import { NextResponse } from "next/server";
import { getAuthenticatedUserFromRequest, getUserRoleFromAccessToken } from "@/lib/server-auth";
import { getStripe } from "@/lib/stripe";
import { createServiceRoleServerSupabase } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const auth = await getAuthenticatedUserFromRequest(request);
    if (!auth?.token || !auth.user?.id) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const role = await getUserRoleFromAccessToken(auth.token);
    if (role !== "admin") {
      return NextResponse.json({ error: "Admin authorization required." }, { status: 403 });
    }

    const body = (await request.json()) as {
      orderId?: string;
      paymentIntentId?: string;
      amountCents?: number;
      reason?: "duplicate" | "fraudulent" | "requested_by_customer";
    };

    if (!body.orderId || !body.paymentIntentId) {
      return NextResponse.json({ error: "orderId and paymentIntentId are required." }, { status: 400 });
    }

    const stripe = getStripe();
    const supabase = createServiceRoleServerSupabase();

    const refund = await stripe.refunds.create({
      payment_intent: body.paymentIntentId,
      amount: typeof body.amountCents === "number" ? body.amountCents : undefined,
      reason: body.reason,
      metadata: {
        order_id: body.orderId,
        admin_id: auth.user.id,
      },
    });

    await supabase.from("refunds").insert({
      order_id: body.orderId,
      stripe_refund_id: refund.id,
      stripe_charge_id: typeof refund.charge === "string" ? refund.charge : null,
      refund_amount_cents: Number(refund.amount ?? 0),
      currency: refund.currency,
      refund_scope: typeof body.amountCents === "number" ? "partial" : "full",
      refund_status: refund.status === "succeeded" ? "succeeded" : "pending",
      initiated_by: auth.user.id,
      reason: body.reason || "requested_by_customer",
      metadata: {
        payment_intent_id: body.paymentIntentId,
      },
    });

    return NextResponse.json({ ok: true, refundId: refund.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create refund." },
      { status: 400 },
    );
  }
}
