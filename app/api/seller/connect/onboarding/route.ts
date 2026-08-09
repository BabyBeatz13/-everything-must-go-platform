import { NextResponse } from "next/server";
import { getAuthenticatedUserFromRequest } from "@/lib/server-auth";
import { getStripe } from "@/lib/stripe";
import { createServiceRoleServerSupabase, createUserScopedServerSupabase } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const auth = await getAuthenticatedUserFromRequest(request);
    if (!auth?.user?.id || !auth.token) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const userSupabase = createUserScopedServerSupabase(auth.token);
    const serviceSupabase = createServiceRoleServerSupabase();
    const stripe = getStripe();

    const { data: sellerProfile, error } = await userSupabase
      .from("seller_profiles")
      .select("id, profile_id, store_name, status, stripe_account_id")
      .eq("profile_id", auth.user.id)
      .maybeSingle();

    if (error || !sellerProfile?.id) {
      return NextResponse.json({ error: "Seller profile not found." }, { status: 404 });
    }

    if (String(sellerProfile.status) !== "approved") {
      return NextResponse.json({ error: "Seller must be approved before Stripe onboarding." }, { status: 403 });
    }

    let stripeAccountId = sellerProfile.stripe_account_id ? String(sellerProfile.stripe_account_id) : "";

    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: auth.user.email,
        business_profile: {
          name: String(sellerProfile.store_name),
        },
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: {
          seller_profile_id: String(sellerProfile.id),
          profile_id: auth.user.id,
        },
      });

      stripeAccountId = account.id;

      await serviceSupabase
        .from("seller_profiles")
        .update({
          stripe_account_id: stripeAccountId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", sellerProfile.id);
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      type: "account_onboarding",
      refresh_url: `${origin}/seller/payments/onboarding`,
      return_url: `${origin}/seller/payments/return`,
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to start Stripe onboarding." },
      { status: 400 },
    );
  }
}
