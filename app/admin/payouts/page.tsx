"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getCurrentUserRole } from "@/lib/client-auth";

type PayoutRow = {
  id: string;
  seller_id: string | null;
  seller_amount_cents: number | null;
  transfer_status: string | null;
  stripe_transfer_id: string | null;
  payout_hold_status: string | null;
  hold_reason: string | null;
};

export default function AdminPayoutsPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [payouts, setPayouts] = useState<PayoutRow[]>([]);

  useEffect(() => {
    void (async () => {
      const role = await getCurrentUserRole();
      if (role !== "admin") {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      setAuthorized(true);
      const { data } = await supabase.from("seller_transfers").select("id, seller_id, seller_amount_cents, transfer_status, stripe_transfer_id").order("created_at", { ascending: false }).limit(100);
      setPayouts((data as PayoutRow[]) ?? []);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] p-8 text-sm uppercase tracking-[0.3em] text-amber-100">Loading payouts...</main>;
  }

  if (!authorized) {
    return <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] p-8 text-sm uppercase tracking-[0.3em] text-rose-200">Unauthorized: admin access required.</main>;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Admin payouts</p>
          <h1 className="mt-2 text-3xl font-semibold">Seller transfer oversight</h1>
        </div>

        <div className="mt-6 space-y-3">
          {payouts.map((payout) => (
            <div key={payout.id} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-white">Seller: {payout.seller_id}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-zinc-500">Transfer: {payout.stripe_transfer_id || "not assigned"}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-300">${((Number(payout.seller_amount_cents ?? 0)) / 100).toFixed(2)}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-400">{payout.transfer_status || "pending"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
