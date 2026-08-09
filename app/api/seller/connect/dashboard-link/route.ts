import { NextResponse } from "next/server";
import { getAuthenticatedUserFromRequest } from "@/lib/server-auth";
import { getStripe } from "@/lib/stripe";
import { createUserScopedServerSupabase } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const auth = await getAuthenticatedUserFromRequest(request);
    if (!auth?.user?.id || !auth.token) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const userSupabase = createUserScopedServerSupabase(auth.token);
    const stripe = getStripe();

    const { data: sellerProfile, error } = await userSupabase
      .from("seller_profiles")
      .select("stripe_account_id")
      .eq("profile_id", auth.user.id)
      .maybeSingle();

    if (error || !sellerProfile?.stripe_account_id) {
      return NextResponse.json({ error: "Stripe account is not connected yet." }, { status: 404 });
    }

    const loginLink = await stripe.accounts.createLoginLink(String(sellerProfile.stripe_account_id));
    return NextResponse.json({ url: loginLink.url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create Stripe dashboard link." },
      { status: 400 },
    );
  }
}
