import { NextResponse } from "next/server";
import { getAuthenticatedUserFromRequest } from "@/lib/server-auth";
import { createServiceRoleServerSupabase, createUserScopedServerSupabase } from "@/lib/supabase-server";
import { getStripe } from "@/lib/stripe";

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
      .select("id, stripe_account_id")
      .eq("profile_id", auth.user.id)
      .maybeSingle();

    if (error || !sellerProfile?.id || !sellerProfile?.stripe_account_id) {
      return NextResponse.json({ error: "Stripe account not connected." }, { status: 404 });
    }

    const account = await stripe.accounts.retrieve(String(sellerProfile.stripe_account_id));

    await serviceSupabase
      .from("seller_profiles")
      .update({
        stripe_onboarding_complete: Boolean(account.details_submitted),
        stripe_charges_enabled: Boolean(account.charges_enabled),
        stripe_payouts_enabled: Boolean(account.payouts_enabled),
        stripe_details_submitted: Boolean(account.details_submitted),
        updated_at: new Date().toISOString(),
      })
      .eq("id", sellerProfile.id);

    return NextResponse.json({
      ok: true,
      onboardingComplete: Boolean(account.details_submitted),
      chargesEnabled: Boolean(account.charges_enabled),
      payoutsEnabled: Boolean(account.payouts_enabled),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to refresh Stripe status." },
      { status: 400 },
    );
  }
}
