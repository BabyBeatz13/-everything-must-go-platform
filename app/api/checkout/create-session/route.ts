import { NextResponse } from "next/server";
import { createStripeCheckoutSessionFromCart } from "@/lib/checkout-server";
import { getAuthenticatedUserFromRequest } from "@/lib/server-auth";

export async function POST(request: Request) {
  try {
    const auth = await getAuthenticatedUserFromRequest(request);
    if (!auth?.user?.id || !auth.token) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const body = (await request.json()) as {
      addressId?: string;
      contactEmail?: string;
      contactPhone?: string;
    };

    if (!body.addressId || !body.contactEmail) {
      return NextResponse.json({ error: "Shipping address and email are required." }, { status: 400 });
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

    const session = await createStripeCheckoutSessionFromCart({
      userId: auth.user.id,
      accessToken: auth.token,
      addressId: body.addressId,
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone,
      origin,
    });

    return NextResponse.json({
      checkoutUrl: session.checkoutUrl,
      orderId: session.orderId,
      sessionId: session.sessionId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create checkout session." },
      { status: 400 },
    );
  }
}
