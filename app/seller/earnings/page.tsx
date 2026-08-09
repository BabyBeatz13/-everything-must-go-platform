"use client";

import { useEffect, useMemo, useState } from "react";
import { getCurrentSellerProfile } from "@/lib/client-auth";
import { supabase } from "@/lib/supabase";

export default function SellerEarningsPage() {
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState<Array<Record<string, unknown>>>([]);
  const [transfers, setTransfers] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    void (async () => {
      const seller = await getCurrentSellerProfile();
      if (!seller?.id) {
        setLoading(false);
        return;
      }

      const [{ data: earningRows }, { data: transferRows }] = await Promise.all([
        supabase
          .from("seller_earnings")
          .select("seller_net_cents, gross_sales_cents, platform_fee_cents, earning_status")
          .eq("seller_id", String(seller.id)),
        supabase
          .from("seller_transfers")
          .select("seller_amount_cents, transfer_status")
          .eq("seller_id", String(seller.id)),
      ]);

      setEarnings((earningRows as Array<Record<string, unknown>>) ?? []);
      setTransfers((transferRows as Array<Record<string, unknown>>) ?? []);
      setLoading(false);
    })();
  }, []);

  const summary = useMemo(() => {
    const grossSales = earnings.reduce((sum, row) => sum + Number(row.gross_sales_cents ?? 0), 0);
    const platformFees = earnings.reduce((sum, row) => sum + Number(row.platform_fee_cents ?? 0), 0);
    const netEarnings = earnings.reduce((sum, row) => sum + Number(row.seller_net_cents ?? 0), 0);
    const pendingTransfers = transfers
      .filter((row) => String(row.transfer_status) === "pending")
      .reduce((sum, row) => sum + Number(row.seller_amount_cents ?? 0), 0);
    const completedTransfers = transfers
      .filter((row) => String(row.transfer_status) === "completed")
      .reduce((sum, row) => sum + Number(row.seller_amount_cents ?? 0), 0);
    const refundAdjustments = earnings
      .filter((row) => String(row.earning_status) === "refunded")
      .reduce((sum, row) => sum + Number(row.seller_net_cents ?? 0), 0);

    return { grossSales, platformFees, netEarnings, pendingTransfers, completedTransfers, refundAdjustments };
  }, [earnings, transfers]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs uppercase tracking-[0.36em] text-amber-200/80">Seller earnings</p>
          <h1 className="mt-2 text-3xl font-semibold">Earnings and transfers</h1>
          <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-amber-100/80">Stripe test mode</p>
        </div>

        {loading ? <p className="mt-4 text-sm uppercase tracking-[0.3em] text-amber-100">Loading seller earnings...</p> : null}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-xs text-zinc-400">Gross sales</p><p className="mt-1 text-2xl font-semibold text-white">${(summary.grossSales / 100).toFixed(2)}</p></div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-xs text-zinc-400">Platform fees</p><p className="mt-1 text-2xl font-semibold text-white">${(summary.platformFees / 100).toFixed(2)}</p></div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-xs text-zinc-400">Net seller earnings</p><p className="mt-1 text-2xl font-semibold text-amber-300">${(summary.netEarnings / 100).toFixed(2)}</p></div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-xs text-zinc-400">Pending transfers</p><p className="mt-1 text-2xl font-semibold text-white">${(summary.pendingTransfers / 100).toFixed(2)}</p></div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-xs text-zinc-400">Completed transfers</p><p className="mt-1 text-2xl font-semibold text-white">${(summary.completedTransfers / 100).toFixed(2)}</p></div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-xs text-zinc-400">Refund adjustments</p><p className="mt-1 text-2xl font-semibold text-white">${(summary.refundAdjustments / 100).toFixed(2)}</p></div>
        </div>
      </div>
    </main>
  );
}
