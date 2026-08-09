"use client";

import Link from "next/link";
import { useEffect } from "react";
import { getSupabaseAccessToken } from "@/lib/client-auth";

export default function SellerPaymentsReturnPage() {
  useEffect(() => {
    void (async () => {
      const token = await getSupabaseAccessToken();
      if (!token) return;

      await fetch("/api/seller/connect/refresh-status", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    })();
  }, []);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[30px] border border-white/10 bg-white/[0.04] p-8 text-center">
        <p className="text-xs uppercase tracking-[0.36em] text-amber-200/80">Stripe onboarding return</p>
        <h1 className="mt-3 text-3xl font-semibold">Setup details received</h1>
        <p className="mt-4 text-zinc-300">Stripe Connect status is refreshed through your seller payments dashboard and webhooks.</p>
        <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-amber-100/80">Stripe test mode</p>
        <Link href="/seller/payments" className="mt-6 inline-flex rounded-full bg-amber-300 px-6 py-3 text-sm font-bold uppercase tracking-[0.24em] text-black">
          Back to seller payments
        </Link>
      </div>
    </main>
  );
}
