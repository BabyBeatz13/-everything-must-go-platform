import { calculateCommissionCents, centsToDollars, dollarsToCents, getMarketplaceCommissionPercent } from "./finance";
import { getStripe } from "./stripe";
import { createServiceRoleServerSupabase, createUserScopedServerSupabase } from "./supabase-server";

type CheckoutInput = {
  userId: string;
  accessToken: string;
  addressId: string;
  contactEmail: string;
  contactPhone?: string;
  origin: string;
};

type ValidatedItem = {
  cartItemId: string;
  productId: string;
  sellerId: string;
  title: string;
  image: string;
  quantity: number;
  unitPriceCents: number;
  shippingCentsPerUnit: number;
  lineSubtotalCents: number;
  lineShippingCents: number;
  platformCommissionCents: number;
  sellerNetCents: number;
};

function buildOrderNumber() {
  const random = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `EMG-${Date.now()}-${random}`;
}

export async function createStripeCheckoutSessionFromCart(input: CheckoutInput) {
  const userSupabase = createUserScopedServerSupabase(input.accessToken);
  const serviceSupabase = createServiceRoleServerSupabase();
  const stripe = getStripe();

  const { data: cart, error: cartError } = await userSupabase
    .from("carts")
    .select("id")
    .eq("profile_id", input.userId)
    .eq("status", "active")
    .maybeSingle();

  if (cartError || !cart?.id) {
    throw new Error("No active cart found.");
  }

  const { data: cartItems, error: cartItemsError } = await userSupabase
    .from("cart_items")
    .select("id, marketplace_product_id, seller_id, quantity")
    .eq("cart_id", cart.id);

  if (cartItemsError || !cartItems || cartItems.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const productIds = cartItems.map((row: Record<string, unknown>) => String(row.marketplace_product_id));

  const { data: products, error: productsError } = await userSupabase
    .from("marketplace_products")
    .select("id, seller_id, title, price, shipping_price, free_shipping, inventory_quantity, status, product_images")
    .in("id", productIds);

  if (productsError || !products) {
    throw new Error("Unable to validate cart products.");
  }

  const sellerIds = Array.from(new Set(products.map((product: Record<string, unknown>) => String(product.seller_id))));

  const { data: sellers, error: sellersError } = await userSupabase
    .from("seller_profiles")
    .select("id, store_name, status")
    .in("id", sellerIds);

  if (sellersError || !sellers) {
    throw new Error("Unable to validate seller status.");
  }

  const productById = new Map(products.map((product: Record<string, unknown>) => [String(product.id), product]));
  const sellerById = new Map(sellers.map((seller: Record<string, unknown>) => [String(seller.id), seller]));

  const validatedItems: ValidatedItem[] = [];

  for (const row of cartItems as Array<Record<string, unknown>>) {
    const productId = String(row.marketplace_product_id);
    const product = productById.get(productId);
    if (!product) {
      throw new Error("A cart item is no longer available.");
    }

    const seller = sellerById.get(String(product.seller_id));
    if (!seller || String(seller.status) !== "approved") {
      throw new Error("One or more sellers are not approved for checkout.");
    }

    if (String(product.status) !== "active") {
      throw new Error("One or more products are inactive.");
    }

    const quantity = Number(row.quantity ?? 0);
    const inventory = Number(product.inventory_quantity ?? 0);
    if (quantity < 1 || quantity > inventory) {
      throw new Error("A cart quantity exceeds available inventory.");
    }

    const unitPriceCents = dollarsToCents(Number(product.price ?? 0));
    const shippingPerUnit = Boolean(product.free_shipping) ? 0 : dollarsToCents(Number(product.shipping_price ?? 0));
    const lineSubtotalCents = unitPriceCents * quantity;
    const lineShippingCents = shippingPerUnit * quantity;
    const platformCommissionCents = calculateCommissionCents(lineSubtotalCents);
    const sellerNetCents = lineSubtotalCents + lineShippingCents - platformCommissionCents;

    validatedItems.push({
      cartItemId: String(row.id),
      productId,
      sellerId: String(product.seller_id),
      title: String(product.title),
      image: Array.isArray(product.product_images) && product.product_images.length > 0 ? String(product.product_images[0]) : "",
      quantity,
      unitPriceCents,
      shippingCentsPerUnit: shippingPerUnit,
      lineSubtotalCents,
      lineShippingCents,
      platformCommissionCents,
      sellerNetCents,
    });
  }

  const subtotalCents = validatedItems.reduce((sum, item) => sum + item.lineSubtotalCents, 0);
  const shippingTotalCents = validatedItems.reduce((sum, item) => sum + item.lineShippingCents, 0);
  const taxTotalCents = 0;
  const platformFeeCents = validatedItems.reduce((sum, item) => sum + item.platformCommissionCents, 0);
  const grandTotalCents = subtotalCents + shippingTotalCents + taxTotalCents;

  const { data: address, error: addressError } = await userSupabase
    .from("customer_addresses")
    .select("*")
    .eq("id", input.addressId)
    .eq("profile_id", input.userId)
    .maybeSingle();

  if (addressError || !address) {
    throw new Error("A valid shipping address is required.");
  }

  const shippingSnapshot = {
    first_name: address.first_name,
    last_name: address.last_name,
    address_line1: address.address_line1,
    address_line2: address.address_line2,
    city: address.city,
    state: address.state,
    postal_code: address.postal_code,
    country: address.country,
    phone: input.contactPhone || address.phone,
    email: input.contactEmail,
  };

  const { data: order, error: orderError } = await userSupabase
    .from("orders")
    .insert({
      customer_id: input.userId,
      order_number: buildOrderNumber(),
      status: "pending_payment",
      payment_status: "pending_payment",
      fulfillment_status: "pending_payment",
      subtotal: centsToDollars(subtotalCents),
      shipping_total: centsToDollars(shippingTotalCents),
      tax_total: centsToDollars(taxTotalCents),
      platform_fee: centsToDollars(platformFeeCents),
      grand_total: centsToDollars(grandTotalCents),
      subtotal_cents: subtotalCents,
      shipping_total_cents: shippingTotalCents,
      tax_total_cents: taxTotalCents,
      platform_fee_cents: platformFeeCents,
      grand_total_cents: grandTotalCents,
      shipping_address_snapshot: shippingSnapshot,
      billing_address_snapshot: shippingSnapshot,
      currency: "usd",
      total_amount: centsToDollars(grandTotalCents),
    })
    .select("id, order_number")
    .single();

  if (orderError || !order?.id) {
    throw new Error("Unable to create pending order.");
  }

  const orderItemsPayload = validatedItems.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    seller_id: item.sellerId,
    product_title_snapshot: item.title,
    quantity: item.quantity,
    unit_price: centsToDollars(item.unitPriceCents),
    unit_price_cents: item.unitPriceCents,
    shipping_amount: centsToDollars(item.lineShippingCents),
    shipping_amount_cents: item.lineShippingCents,
    platform_commission_amount: centsToDollars(item.platformCommissionCents),
    platform_commission_cents: item.platformCommissionCents,
    seller_earnings_amount: centsToDollars(item.sellerNetCents),
    seller_earnings_cents: item.sellerNetCents,
    fulfillment_status: "pending_payment",
  }));

  const { error: orderItemsError } = await userSupabase.from("order_items").insert(orderItemsPayload);
  if (orderItemsError) {
    throw new Error("Unable to create order items.");
  }

  const lineItems = validatedItems.flatMap((item) => {
    const baseItem = {
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: item.unitPriceCents,
        product_data: {
          name: item.title,
          images: item.image ? [item.image] : [],
          metadata: {
            product_id: item.productId,
            seller_id: item.sellerId,
          },
        },
      },
    };

    if (item.shippingCentsPerUnit <= 0) {
      return [baseItem];
    }

    return [
      baseItem,
      {
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: item.shippingCentsPerUnit,
          product_data: {
            name: `Shipping - ${item.title}`,
            metadata: {
              product_id: item.productId,
              seller_id: item.sellerId,
              type: "shipping",
            },
          },
        },
      },
    ];
  });

  const successUrl = `${input.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${input.origin}/checkout/cancel?order=${order.id}`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: order.id,
    customer_email: input.contactEmail,
    metadata: {
      order_id: order.id,
      customer_id: input.userId,
      commission_percent: String(getMarketplaceCommissionPercent()),
    },
    payment_intent_data: {
      metadata: {
        order_id: order.id,
        customer_id: input.userId,
      },
      transfer_group: `order_${order.id}`,
    },
  });

  await serviceSupabase
    .from("orders")
    .update({ stripe_checkout_session_id: session.id, updated_at: new Date().toISOString() })
    .eq("id", order.id);

  return {
    checkoutUrl: session.url,
    orderId: order.id,
    sessionId: session.id,
  };
}
