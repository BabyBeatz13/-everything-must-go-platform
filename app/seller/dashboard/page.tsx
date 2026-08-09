"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MarketplaceCard } from "@/components/marketplace/MarketplaceCard";
import { SellerShell } from "@/components/seller/SellerShell";
import { getSellerDashboardMetrics, getSellerIdentity, getSellerProductsPortal, type SellerDashboardMetrics } from "@/lib/seller-portal";

function currency(cents: number) {
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function SellerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState("Seller store");
  const [metrics, setMetrics] = useState<SellerDashboardMetrics | null>(null);
  const [productRows, setProductRows] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    void (async () => {
      const [identity, dashboardMetrics, products] = await Promise.all([
        getSellerIdentity(),
        getSellerDashboardMetrics(),
        getSellerProductsPortal(),
      ]);

      if (identity?.storeName) {
        setStoreName(identity.storeName);
      }

      setMetrics(dashboardMetrics);
      setProductRows(products.slice(0, 5));
      setLoading(false);
    })();
  }, []);

  return (
    <SellerShell
      title={storeName}
      subtitle="Revenue, orders, product velocity, and payout status in one command center."
      rightSlot={
        <Link href="/seller/products/new" className="rounded-full bg-amber-300 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.2em] text-black">
          Add product
        </Link>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total revenue" value={loading ? "..." : currency(metrics?.totalRevenueCents ?? 0)} />
        <MetricCard label="Pending payouts" value={loading ? "..." : currency(metrics?.pendingPayoutCents ?? 0)} />
        <MetricCard label="Available balance" value={loading ? "..." : currency(metrics?.availableBalanceCents ?? 0)} />
        <MetricCard label="Total orders" value={loading ? "..." : String(metrics?.totalOrders ?? 0)} />
        <MetricCard label="Products sold" value={loading ? "..." : String(metrics?.productsSold ?? 0)} />
        <MetricCard label="Views" value={loading ? "..." : String(metrics?.views ?? 0)} />
        <MetricCard label="Conversion rate" value={loading ? "..." : `${metrics?.conversionRate ?? 0}%`} />
        <MetricCard label="Recent orders" value={loading ? "..." : String(metrics?.recentOrders.length ?? 0)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <MarketplaceCard title="Recent orders" description="Most recent buyer activity tied to your listings.">
          <div className="space-y-3">
            {(metrics?.recentOrders ?? []).map((order) => (
              <Link key={String(order.orderId)} href={`/seller/orders/${String(order.orderId)}`} className="block rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{String(order.order_number ?? order.orderId)}</p>
                    <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{new Date(String(order.created_at ?? new Date().toISOString())).toLocaleString()}</p>
                  </div>
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-300">{String(order.payment_status ?? "pending")} • {String(order.fulfillment_status ?? "pending")}</p>
                </div>
              </Link>
            ))}
            {!loading && (metrics?.recentOrders.length ?? 0) === 0 ? <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-300">No recent orders yet.</p> : null}
          </div>
        </MarketplaceCard>

        <MarketplaceCard title="Seller notifications" description="Operational prompts for payouts, approvals, and traffic health.">
          <ul className="space-y-3">
            {(metrics?.notifications ?? []).map((message) => (
              <li key={message} className="rounded-2xl border border-amber-300/35 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">{message}</li>
            ))}
            {!loading && (metrics?.notifications.length ?? 0) === 0 ? <li className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-300">No alerts. Seller operations are healthy.</li> : null}
          </ul>
        </MarketplaceCard>
      </div>

      <MarketplaceCard title="Top listings snapshot" description="Quick view of inventory and status across active catalog items.">
        <div className="space-y-3">
          {productRows.map((product) => (
            <div key={String(product.id)} className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{String(product.title ?? "Untitled product")}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{String(product.category ?? "uncategorized")} • {String(product.status ?? "draft")}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-300">${Number(product.price ?? 0).toFixed(2)}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Stock {Number(product.inventory_quantity ?? 0)}</p>
                </div>
              </div>
            </div>
          ))}
          {!loading && productRows.length === 0 ? <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-300">No products yet. Add your first listing to begin tracking conversion.</p> : null}
        </div>
      </MarketplaceCard>
    </SellerShell>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
      <p className="text-[10px] uppercase tracking-[0.35em] text-amber-200/80">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}
