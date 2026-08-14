"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getCurrentUserRole } from "@/lib/client-auth";

const metricCard = (label: string, value: string, accent = "text-white") => ({
  label,
  value,
  accent,
});

export default function AdminDashboardPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Record<string, number | string>>({});

  useEffect(() => {
    void (async () => {
      const role = await getCurrentUserRole();
      if (role !== "admin") {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      setAuthorized(true);

      const [profiles, sellers, products, orders, returns, disputes, authenticity, fees, transfers, refunds, holds] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("seller_profiles").select("id", { count: "exact", head: true }),
        supabase.from("marketplace_products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("return_requests").select("id", { count: "exact", head: true }),
        supabase.from("customer_protection_cases").select("id", { count: "exact", head: true }),
        supabase.from("listing_authenticity_reviews").select("id", { count: "exact", head: true }),
        supabase.from("platform_fees").select("fee_amount_cents"),
        supabase.from("seller_transfers").select("seller_amount_cents, transfer_status"),
        supabase.from("refunds").select("refund_amount_cents, refund_status"),
        supabase.from("payout_holds").select("id", { count: "exact", head: true }),
      ]);

      const feeRows = (fees.data as Array<Record<string, unknown>> | null) ?? [];
      const transferRows = (transfers.data as Array<Record<string, unknown>> | null) ?? [];
      const refundRows = (refunds.data as Array<Record<string, unknown>> | null) ?? [];

      const totalFees = feeRows.reduce((sum, row) => sum + Number(row.fee_amount_cents ?? 0), 0);
      const pendingTransfers = transferRows
        .filter((row) => String(row.transfer_status) === "pending")
        .reduce((sum, row) => sum + Number(row.seller_amount_cents ?? 0), 0);
      const refundTotal = refundRows.reduce((sum, row) => sum + Number(row.refund_amount_cents ?? 0), 0);

      setStats({
        totalUsers: profiles.count ?? 0,
        totalCustomers: (profiles.count ?? 0) - (sellers.count ?? 0),
        totalSellers: sellers.count ?? 0,
        verifiedSellers: 0,
        verifiedLuxurySellers: 0,
        pendingSellerApplications: 0,
        activeProducts: products.count ?? 0,
        pendingListings: 0,
        flaggedListings: 0,
        totalOrders: orders.count ?? 0,
        paidOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        openReturns: returns.count ?? 0,
        openDisputes: disputes.count ?? 0,
        authenticityReviewsPending: authenticity.count ?? 0,
        grossMerchandiseValue: 0,
        platformFeesEarned: totalFees,
        sellerEarnings: 0,
        pendingTransfers,
        refundTotals: refundTotal,
        payoutHolds: holds.count ?? 0,
      });
      setLoading(false);
    })();
  }, []);

  const cards = useMemo(() => [
    metricCard("Total users", String(stats.totalUsers ?? 0)),
    metricCard("Total customers", String(stats.totalCustomers ?? 0)),
    metricCard("Total sellers", String(stats.totalSellers ?? 0)),
    metricCard("Verified sellers", String(stats.verifiedSellers ?? 0)),
    metricCard("Verified Luxury Sellers", String(stats.verifiedLuxurySellers ?? 0)),
    metricCard("Pending seller applications", String(stats.pendingSellerApplications ?? 0)),
    metricCard("Active products", String(stats.activeProducts ?? 0)),
    metricCard("Pending listings", String(stats.pendingListings ?? 0)),
    metricCard("Flagged listings", String(stats.flaggedListings ?? 0)),
    metricCard("Total orders", String(stats.totalOrders ?? 0)),
    metricCard("Paid orders", String(stats.paidOrders ?? 0)),
    metricCard("Shipped orders", String(stats.shippedOrders ?? 0)),
    metricCard("Delivered orders", String(stats.deliveredOrders ?? 0)),
    metricCard("Open returns", String(stats.openReturns ?? 0)),
    metricCard("Open disputes", String(stats.openDisputes ?? 0)),
    metricCard("Authenticity reviews pending", String(stats.authenticityReviewsPending ?? 0)),
    metricCard("Gross merchandise value", `$${((Number(stats.grossMerchandiseValue ?? 0)) / 100).toFixed(2)}`),
    metricCard("Platform fees earned", `$${((Number(stats.platformFeesEarned ?? 0)) / 100).toFixed(2)}`),
    metricCard("Seller earnings", `$${((Number(stats.sellerEarnings ?? 0)) / 100).toFixed(2)}`),
    metricCard("Pending transfers", `$${((Number(stats.pendingTransfers ?? 0)) / 100).toFixed(2)}`),
    metricCard("Refund totals", `$${((Number(stats.refundTotals ?? 0)) / 100).toFixed(2)}`),
    metricCard("Payout holds", String(stats.payoutHolds ?? 0)),
  ], [stats]);

  if (loading) {
    return <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] p-8 text-sm uppercase tracking-[0.3em] text-amber-100">Loading admin dashboard...</main>;
  }

  if (!authorized) {
    return <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] p-8 text-sm uppercase tracking-[0.3em] text-rose-200">Unauthorized: admin access required.</main>;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-amber-300/20 bg-white/[0.03] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Admin dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold">Marketplace operations overview</h1>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className="rounded-[24px] border border-white/10 bg-black/35 p-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-400">{card.label}</p>
              <p className={`mt-3 text-2xl font-semibold ${card.accent || "text-white"}`}>{card.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-[10px] uppercase tracking-[0.38em] text-amber-200/80">Recent marketplace activity</p>
            <div className="mt-4 space-y-3">
              {[
                "Seller application reviewed for Golden Crest Studio",
                "Authenticity review assigned to luxury handbag listing",
                "Payout hold placed for a flagged seller account",
                "Customer return request requires admin review",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-zinc-200">{item}</div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-[10px] uppercase tracking-[0.38em] text-amber-200/80">Priority alerts</p>
            <div className="mt-4 space-y-3">
              {[
                { label: "High risk seller review", tone: "bg-rose-500/10 text-rose-200 border-rose-500/30" },
                { label: "Authenticity case escalated", tone: "bg-amber-500/10 text-amber-200 border-amber-500/30" },
                { label: "Refund batch pending approval", tone: "bg-emerald-500/10 text-emerald-200 border-emerald-500/30" },
              ].map((alert) => (
                <div key={alert.label} className={`rounded-2xl border p-3 text-sm ${alert.tone}`}>{alert.label}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
