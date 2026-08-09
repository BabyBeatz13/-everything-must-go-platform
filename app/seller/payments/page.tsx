"use client";

import { useEffect, useState } from "react";
import { getCurrentSellerProfile, getSupabaseAccessToken } from "@/lib/client-auth";

export default function SellerPaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [existingAccountId, setExistingAccountId] = useState("");

  async function refreshStatus(showMessage = false) {
    const token = await getSupabaseAccessToken();
    if (token) {
      await fetch("/api/seller/connect/refresh-status", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    const sellerProfile = await getCurrentSellerProfile();
    setProfile(sellerProfile);

    if (showMessage) {
      setMessage("Stripe status refreshed.");
    }
  }

  useEffect(() => {
    void (async () => {
      await refreshStatus(false);
      setLoading(false);
    })();
  }, []);

  async function startOnboarding() {
    const token = await getSupabaseAccessToken();
    if (!token) {
      setMessage("Please log in with a Supabase session to continue Stripe onboarding.");
      return;
    }

    const response = await fetch("/api/seller/connect/onboarding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = (await response.json()) as { url?: string; error?: string };
    if (!response.ok || !payload.url) {
      setMessage(payload.error || "Unable to start onboarding.");
      return;
    }

    window.location.href = payload.url;
  }

  async function openStripeDashboard() {
    const token = await getSupabaseAccessToken();
    if (!token) {
      setMessage("Please log in with a Supabase session to continue.");
      return;
    }

    const response = await fetch("/api/seller/connect/dashboard-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = (await response.json()) as { url?: string; error?: string };
    if (!response.ok || !payload.url) {
      setMessage(payload.error || "Unable to open Stripe dashboard.");
      return;
    }

    window.location.href = payload.url;
  }

  async function linkExistingExpressAccount() {
    const token = await getSupabaseAccessToken();
    if (!token) {
      setMessage("Please log in with a Supabase session to continue.");
      return;
    }

    const response = await fetch("/api/seller/connect/link-existing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stripeAccountId: existingAccountId }),
    });

    const payload = (await response.json()) as { error?: string; stripeAccountId?: string };
    if (!response.ok) {
      setMessage(payload.error || "Unable to link Stripe account.");
      return;
    }

    setMessage(`Linked Stripe account ${payload.stripeAccountId}.`);
    await refreshStatus(false);
  }

  if (loading) {
    return <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] p-8 text-sm uppercase tracking-[0.3em] text-amber-100">Loading seller payments...</main>;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.36em] text-amber-200/80">Seller payments</p>
          <h1 className="mt-2 text-3xl font-semibold">Stripe Connect setup</h1>
          <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-amber-100/80">Stripe test mode</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm">
              <p className="text-zinc-400">Connect onboarding</p>
              <p className="mt-1 font-semibold text-white">{profile?.stripe_onboarding_complete ? "Complete" : "Incomplete"}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm">
              <p className="text-zinc-400">Charges enabled</p>
              <p className="mt-1 font-semibold text-white">{profile?.stripe_charges_enabled ? "Yes" : "No"}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm">
              <p className="text-zinc-400">Payouts enabled</p>
              <p className="mt-1 font-semibold text-white">{profile?.stripe_payouts_enabled ? "Yes" : "No"}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm">
              <p className="text-zinc-400">Earnings summary</p>
              <p className="mt-1 font-semibold text-white">Available in seller earnings</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => void startOnboarding()} className="rounded-full bg-amber-300 px-5 py-3 text-sm font-bold uppercase tracking-[0.24em] text-black">
              Complete setup
            </button>
            <button type="button" onClick={() => void openStripeDashboard()} className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold uppercase tracking-[0.24em] text-white">
              Manage Stripe account
            </button>
            <button type="button" onClick={() => void refreshStatus(true)} className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold uppercase tracking-[0.24em] text-white">
              Refresh status
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.26em] text-zinc-400">Link existing Express account</p>
            <p className="mt-2 text-sm text-zinc-300">If you already created a Stripe Express account in sandbox, paste its account ID (acct_...).</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                value={existingAccountId}
                onChange={(event) => setExistingAccountId(event.target.value)}
                placeholder="acct_123..."
                className="flex-1 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none"
              />
              <button
                type="button"
                onClick={() => void linkExistingExpressAccount()}
                className="rounded-full bg-amber-300 px-5 py-3 text-sm font-bold uppercase tracking-[0.24em] text-black"
              >
                Link account
              </button>
            </div>
          </div>

          {message ? <p className="mt-4 text-sm text-amber-100">{message}</p> : null}
        </div>
      </div>
    </main>
  );
}
