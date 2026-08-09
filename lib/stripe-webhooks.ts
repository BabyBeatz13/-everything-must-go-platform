import type Stripe from "stripe";
import { createServiceRoleServerSupabase } from "./supabase-server";
import { centsToDollars } from "./finance";
import { getStripe } from "./stripe";

async function recordWebhookEvent(event: Stripe.Event) {
  const supabase = createServiceRoleServerSupabase();

  const { data: existing } = await supabase
    .from("webhook_events")
    .select("id, processed")
    .eq("stripe_event_id", event.id)
    .maybeSingle();

  if (existing?.processed) {
    return { duplicate: true, id: String(existing.id) };
  }

  if (!existing?.id) {
    const { data: inserted, error } = await supabase
      .from("webhook_events")
      .insert({
        stripe_event_id: event.id,
        event_type: event.type,
        payload: event as unknown as Record<string, unknown>,
        processed: false,
      })
      .select("id")
      .single();

    if (error || !inserted?.id) {
      throw new Error("Unable to record webhook event.");
    }

    return { duplicate: false, id: String(inserted.id) };
  }

  return { duplicate: false, id: String(existing.id) };
}

async function markWebhookProcessed(webhookEventId: string) {
  const supabase = createServiceRoleServerSupabase();
  await supabase
    .from("webhook_events")
    .update({ processed: true, processed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", webhookEventId);
}

async function findOrderIdForPaymentIntent(paymentIntentId: string) {
  const supabase = createServiceRoleServerSupabase();
  const { data } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_payment_intent_id", paymentIntentId)
    .maybeSingle();
  return data?.id ? String(data.id) : null;
}

async function createSellerTransfers(orderId: string) {
  const supabase = createServiceRoleServerSupabase();
  const stripe = getStripe();

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("id, seller_id, seller_earnings_cents, platform_commission_cents, shipping_amount_cents")
    .eq("order_id", orderId);

  if (!orderItems || orderItems.length === 0) return;

  const grouped = new Map<string, { sellerAmountCents: number; platformFeeCents: number; grossCents: number }>();

  for (const row of orderItems as Array<Record<string, unknown>>) {
    const sellerId = String(row.seller_id ?? "");
    if (!sellerId) continue;

    const sellerAmount = Number(row.seller_earnings_cents ?? 0);
    const platformFee = Number(row.platform_commission_cents ?? 0);
    const shipping = Number(row.shipping_amount_cents ?? 0);

    const current = grouped.get(sellerId) ?? { sellerAmountCents: 0, platformFeeCents: 0, grossCents: 0 };
    current.sellerAmountCents += sellerAmount;
    current.platformFeeCents += platformFee;
    current.grossCents += sellerAmount + platformFee - shipping;
    grouped.set(sellerId, current);
  }

  for (const [sellerId, totals] of grouped) {
    const { data: existingTransfer } = await supabase
      .from("seller_transfers")
      .select("id")
      .eq("seller_id", sellerId)
      .eq("order_id", orderId)
      .maybeSingle();

    if (existingTransfer?.id) {
      continue;
    }

    const { data: sellerProfile } = await supabase
      .from("seller_profiles")
      .select("stripe_account_id, stripe_onboarding_complete, stripe_charges_enabled, stripe_payouts_enabled")
      .eq("id", sellerId)
      .maybeSingle();

    let transferId: string | null = null;
    let transferStatus: "pending" | "completed" | "failed" = "pending";

    const canTransfer = Boolean(
      sellerProfile?.stripe_account_id
      && sellerProfile?.stripe_onboarding_complete
      && sellerProfile?.stripe_charges_enabled
      && sellerProfile?.stripe_payouts_enabled,
    );

    if (canTransfer && totals.sellerAmountCents > 0) {
      try {
        const transfer = await stripe.transfers.create({
          amount: totals.sellerAmountCents,
          currency: "usd",
          destination: String(sellerProfile?.stripe_account_id),
          transfer_group: `order_${orderId}`,
          metadata: {
            order_id: orderId,
            seller_id: sellerId,
          },
        });

        transferId = transfer.id;
        transferStatus = "completed";
      } catch {
        transferStatus = "failed";
      }
    }

    await supabase.from("seller_transfers").insert({
      seller_id: sellerId,
      order_id: orderId,
      stripe_transfer_id: transferId,
      gross_sales_cents: totals.grossCents,
      platform_fee_cents: totals.platformFeeCents,
      seller_amount_cents: totals.sellerAmountCents,
      currency: "usd",
      transfer_status: transferStatus,
      metadata: { mode: "test" },
    });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const supabase = createServiceRoleServerSupabase();
  const orderId = String(session.metadata?.order_id ?? session.client_reference_id ?? "");
  if (!orderId) return;

  await supabase
    .from("orders")
    .update({
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent ? String(session.payment_intent) : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);
}

async function clearPurchasedCartItems(orderId: string, customerId: string) {
  const supabase = createServiceRoleServerSupabase();

  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("profile_id", customerId)
    .eq("status", "active")
    .maybeSingle();

  if (!cart?.id) return;

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("product_id")
    .eq("order_id", orderId);

  const productIds = (orderItems ?? []).map((row: Record<string, unknown>) => String(row.product_id));
  if (productIds.length === 0) return;

  await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cart.id)
    .in("marketplace_product_id", productIds);
}

async function handlePaymentIntentSucceeded(intent: Stripe.PaymentIntent) {
  const supabase = createServiceRoleServerSupabase();

  const orderIdFromMetadata = intent.metadata?.order_id;
  const orderId = orderIdFromMetadata || await findOrderIdForPaymentIntent(intent.id);
  if (!orderId) return;

  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id, customer_id, payment_status")
    .eq("id", orderId)
    .maybeSingle();

  if (!existingOrder?.id) return;
  if (existingOrder.payment_status === "paid") return;

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("id, product_id, seller_id, quantity, platform_commission_cents, seller_earnings_cents, shipping_amount_cents")
    .eq("order_id", orderId);

  if (!orderItems || orderItems.length === 0) return;

  for (const item of orderItems as Array<Record<string, unknown>>) {
    const { data: decremented } = await supabase.rpc("decrement_marketplace_inventory", {
      p_product_id: String(item.product_id),
      p_quantity: Number(item.quantity),
    });

    if (!decremented) {
      throw new Error("Inventory update failed; preventing negative stock.");
    }

    await supabase.from("platform_fees").insert({
      order_id: orderId,
      order_item_id: String(item.id),
      seller_id: String(item.seller_id),
      fee_amount_cents: Number(item.platform_commission_cents ?? 0),
      fee_type: "commission",
      currency: "usd",
      metadata: { payment_intent_id: intent.id },
    });

    await supabase.from("seller_earnings").upsert(
      {
        seller_id: String(item.seller_id),
        order_id: orderId,
        order_item_id: String(item.id),
        gross_sales_cents: Number(item.seller_earnings_cents ?? 0) + Number(item.platform_commission_cents ?? 0) - Number(item.shipping_amount_cents ?? 0),
        shipping_cents: Number(item.shipping_amount_cents ?? 0),
        platform_fee_cents: Number(item.platform_commission_cents ?? 0),
        seller_net_cents: Number(item.seller_earnings_cents ?? 0),
        currency: "usd",
        earning_status: "available",
        metadata: { payment_intent_id: intent.id },
      },
      { onConflict: "seller_id,order_id,order_item_id" },
    );
  }

  await supabase
    .from("orders")
    .update({
      payment_status: "paid",
      status: "processing",
      fulfillment_status: "processing",
      stripe_payment_intent_id: intent.id,
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  await createSellerTransfers(orderId);

  if (existingOrder.customer_id) {
    await clearPurchasedCartItems(orderId, String(existingOrder.customer_id));
  }
}

async function handlePaymentIntentFailed(intent: Stripe.PaymentIntent) {
  const supabase = createServiceRoleServerSupabase();
  const orderId = intent.metadata?.order_id || await findOrderIdForPaymentIntent(intent.id);
  if (!orderId) return;

  await supabase
    .from("orders")
    .update({
      payment_status: "failed",
      status: "cancelled",
      fulfillment_status: "cancelled",
      stripe_payment_intent_id: intent.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  const supabase = createServiceRoleServerSupabase();
  const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : null;
  if (!paymentIntentId) return;

  const orderId = await findOrderIdForPaymentIntent(paymentIntentId);
  if (!orderId) return;

  const totalPaid = charge.amount;
  const totalRefunded = charge.amount_refunded;
  const paymentStatus = totalRefunded >= totalPaid ? "refunded" : "partially_refunded";

  await supabase
    .from("orders")
    .update({
      payment_status: paymentStatus,
      status: paymentStatus,
      fulfillment_status: paymentStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  await supabase.from("refunds").insert({
    order_id: orderId,
    stripe_refund_id: null,
    stripe_charge_id: charge.id,
    refund_amount_cents: totalRefunded,
    currency: charge.currency,
    refund_scope: totalRefunded >= totalPaid ? "full" : "partial",
    refund_status: "succeeded",
    reason: "stripe_charge_refunded",
    metadata: { payment_intent_id: paymentIntentId },
  });
}

async function handleChargeDisputeCreated(dispute: Stripe.Dispute) {
  const supabase = createServiceRoleServerSupabase();

  const paymentIntentId = typeof dispute.payment_intent === "string" ? dispute.payment_intent : null;
  if (!paymentIntentId) return;

  const orderId = await findOrderIdForPaymentIntent(paymentIntentId);
  if (!orderId) return;

  await supabase
    .from("orders")
    .update({
      payment_status: "failed",
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  await supabase.from("refunds").insert({
    order_id: orderId,
    stripe_refund_id: null,
    stripe_charge_id: String(dispute.charge ?? ""),
    refund_amount_cents: Number(dispute.amount ?? 0),
    currency: dispute.currency,
    refund_scope: "partial",
    refund_status: "pending",
    reason: "stripe_dispute_created",
    metadata: {
      dispute_id: dispute.id,
      payment_intent_id: paymentIntentId,
      evidence_due_by: dispute.evidence_details?.due_by,
    },
  });
}

async function handleAccountUpdated(account: Stripe.Account) {
  const supabase = createServiceRoleServerSupabase();

  await supabase
    .from("seller_profiles")
    .update({
      stripe_onboarding_complete: Boolean(account.details_submitted),
      stripe_charges_enabled: Boolean(account.charges_enabled),
      stripe_payouts_enabled: Boolean(account.payouts_enabled),
      stripe_details_submitted: Boolean(account.details_submitted),
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_account_id", account.id);
}

export async function processStripeWebhookEvent(event: Stripe.Event) {
  const savedEvent = await recordWebhookEvent(event);
  if (savedEvent.duplicate) {
    return { ok: true, duplicate: true };
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case "payment_intent.succeeded":
      await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
      break;
    case "payment_intent.payment_failed":
      await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
      break;
    case "charge.refunded":
      await handleChargeRefunded(event.data.object as Stripe.Charge);
      break;
    case "charge.dispute.created":
      await handleChargeDisputeCreated(event.data.object as Stripe.Dispute);
      break;
    case "account.updated":
      await handleAccountUpdated(event.data.object as Stripe.Account);
      break;
    default:
      break;
  }

  await markWebhookProcessed(savedEvent.id);
  return { ok: true, duplicate: false };
}

export function buildWebhookEvent(rawBody: string, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET.");
  }

  const stripe = getStripe();
  return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
}
