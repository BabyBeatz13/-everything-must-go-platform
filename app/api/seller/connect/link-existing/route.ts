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

    const body = (await request.json()) as { stripeAccountId?: string };
    const stripeAccountId = (body.stripeAccountId || "").trim();
    if (!stripeAccountId.startsWith("acct_")) {
      return NextResponse.json({ error: "A valid Stripe account ID is required." }, { status: 400 });
    }

    const userSupabase = createUserScopedServerSupabase(auth.token);
    const serviceSupabase = createServiceRoleServerSupabase();
    const stripe = getStripe();

    const { data: sellerProfile, error: sellerError } = await userSupabase
      .from("seller_profiles")
      .select("id, status")
      .eq("profile_id", auth.user.id)
      .maybeSingle();

    if (sellerError || !sellerProfile?.id) {
      return NextResponse.json({ error: "Seller profile not found." }, { status: 404 });
    }

    if (String(sellerProfile.status) !== "approved") {
      return NextResponse.json({ error: "Seller must be approved before linking Stripe." }, { status: 403 });
    }

    const account = await stripe.accounts.retrieve(stripeAccountId);
    if (!account || account.type !== "express") {
      return NextResponse.json({ error: "Only Stripe Express accounts are supported." }, { status: 400 });
    }

    await serviceSupabase
      .from("seller_profiles")
      .update({
        stripe_account_id: stripeAccountId,
        stripe_onboarding_complete: Boolean(account.details_submitted),
        stripe_charges_enabled: Boolean(account.charges_enabled),
        stripe_payouts_enabled: Boolean(account.payouts_enabled),
        stripe_details_submitted: Boolean(account.details_submitted),
        updated_at: new Date().toISOString(),
      })
      .eq("id", sellerProfile.id);

    return NextResponse.json({
      ok: true,
      stripeAccountId,
      onboardingComplete: Boolean(account.details_submitted),
      chargesEnabled: Boolean(account.charges_enabled),
      payoutsEnabled: Boolean(account.payouts_enabled),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to link Stripe account." },
      { status: 400 },
    );
  }
}
