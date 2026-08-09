"use client";

import { useEffect, useMemo, useState } from "react";
import { getCurrentUserRole } from "@/lib/client-auth";
import { supabase } from "@/lib/supabase";

export default function AdminPaymentsPage() {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fees, setFees] = useState<Array<Record<string, unknown>>>([]);
  const [earnings, setEarnings] = useState<Array<Record<string, unknown>>>([]);
  const [transfers, setTransfers] = useState<Array<Record<string, unknown>>>([]);
  const [refunds, setRefunds] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    void (async () => {
      const role = await getCurrentUserRole();
      if (role !== "admin") {
        setAllowed(false);
        setLoading(false);
        return;
      }

      setAllowed(true);

      const [feeRows, earningRows, transferRows, refundRows] = await Promise.all([
        supabase.from("platform_fees").select("fee_amount_cents, fee_type"),
        supabase.from("seller_earnings").select("gross_sales_cents, platform_fee_cents, seller_net_cents, earning_status"),
        supabase.from("seller_transfers").select("seller_amount_cents, transfer_status"),
        supabase.from("refunds").select("refund_amount_cents, refund_status"),
      ]);

      setFees((feeRows.data as Array<Record<string, unknown>>) ?? []);
      setEarnings((earningRows.data as Array<Record<string, unknown>>) ?? []);
      setTransfers((transferRows.data as Array<Record<string, unknown>>) ?? []);
      setRefunds((refundRows.data as Array<Record<string, unknown>>) ?? []);
      setLoading(false);
    })();
  }, []);

  const summary = useMemo(() => {
    const platformCommission = fees.reduce((sum, row) => sum + Number(row.fee_amount_cents ?? 0), 0);
    const grossSales = earnings.reduce((sum, row) => sum + Number(row.gross_sales_cents ?? 0), 0);
    const sellerNet = earnings.reduce((sum, row) => sum + Number(row.seller_net_cents ?? 0), 0);
    const pendingTransfers = transfers.filter((row) => String(row.transfer_status) === "pending").reduce((sum, row) => sum + Number(row.seller_amount_cents ?? 0), 0);
    const completedTransfers = transfers.filter((row) => String(row.transfer_status) === "completed").reduce((sum, row) => sum + Number(row.seller_amount_cents ?? 0), 0);
    const refundTotal = refunds.reduce((sum, row) => sum + Number(row.refund_amount_cents ?? 0), 0);

    return { platformCommission, grossSales, sellerNet, pendingTransfers, completedTransfers, refundTotal };
  }, [fees, earnings, transfers, refunds]);

  if (loading) {
    return <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] p-8 text-sm uppercase tracking-[0.3em] text-amber-100">Loading admin payments...</main>;
  }

  if (!allowed) {
    return <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] p-8 text-sm uppercase tracking-[0.3em] text-rose-200">Unauthorized: admin access required.</main>;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs uppercase tracking-[0.36em] text-amber-200/80">Admin payments</p>
          <h1 className="mt-2 text-3xl font-semibold">Finance and transfer monitoring</h1>
          <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-amber-100/80">Stripe test mode</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-xs text-zinc-400">Marketplace gross sales</p><p className="mt-1 text-2xl font-semibold text-white">${(summary.grossSales / 100).toFixed(2)}</p></div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-xs text-zinc-400">Platform commission</p><p className="mt-1 text-2xl font-semibold text-white">${(summary.platformCommission / 100).toFixed(2)}</p></div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-xs text-zinc-400">Seller net earnings</p><p className="mt-1 text-2xl font-semibold text-white">${(summary.sellerNet / 100).toFixed(2)}</p></div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-xs text-zinc-400">Pending transfers</p><p className="mt-1 text-2xl font-semibold text-white">${(summary.pendingTransfers / 100).toFixed(2)}</p></div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-xs text-zinc-400">Completed transfers</p><p className="mt-1 text-2xl font-semibold text-white">${(summary.completedTransfers / 100).toFixed(2)}</p></div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-xs text-zinc-400">Refund total</p><p className="mt-1 text-2xl font-semibold text-white">${(summary.refundTotal / 100).toFixed(2)}</p></div>
        </div>
      </div>
    </main>
  );
}
