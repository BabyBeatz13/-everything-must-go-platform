import { NextResponse } from "next/server";
import { buildWebhookEvent, processStripeWebhookEvent } from "@/lib/stripe-webhooks";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing stripe signature." }, { status: 400 });
    }

    const rawBody = await request.text();
    const event = buildWebhookEvent(rawBody, signature);
    const result = await processStripeWebhookEvent(event);

    return NextResponse.json({ received: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook processing failed." },
      { status: 400 },
    );
  }
}
