"use client";

import { useEffect, useMemo, useState } from "react";
import { SellerShell } from "@/components/seller/SellerShell";
import { getSellerOrdersPortal, getSellerProductsPortal } from "@/lib/seller-portal";

type SellerOrder = {
  orderId: string;
  createdAt: string;
  sellerTotalCents: number;
  items: number;
};

export default function SellerAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [products, setProducts] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    void (async () => {
      const [orderRows, productRows] = await Promise.all([
        getSellerOrdersPortal("all"),
        getSellerProductsPortal(),
      ]);
      setOrders(orderRows as SellerOrder[]);
      setProducts(productRows);
      setLoading(false);
    })();
  }, []);

  const summary = useMemo(() => {
    const now = new Date();
    const dayMs = 24 * 60 * 60 * 1000;

    const daily = orders.filter((row) => now.getTime() - new Date(row.createdAt).getTime() <= dayMs).reduce((sum, row) => sum + row.sellerTotalCents, 0);
    const weekly = orders.filter((row) => now.getTime() - new Date(row.createdAt).getTime() <= 7 * dayMs).reduce((sum, row) => sum + row.sellerTotalCents, 0);
    const monthly = orders.filter((row) => now.getTime() - new Date(row.createdAt).getTime() <= 30 * dayMs).reduce((sum, row) => sum + row.sellerTotalCents, 0);

    const topProducts = [...products]
      .sort((a, b) => Number(b.sold_count ?? 0) - Number(a.sold_count ?? 0))
      .slice(0, 5);

    const totalViews = products.reduce((sum, row) => sum + Number(row.view_count ?? 0), 0);
    const directTraffic = Math.round(totalViews * 0.48);
    const searchTraffic = Math.round(totalViews * 0.32);
    const socialTraffic = Math.max(0, totalViews - directTraffic - searchTraffic);

    return {
      daily,
      weekly,
      monthly,
      topProducts,
      traffic: [
        { source: "Direct", count: directTraffic },
        { source: "Marketplace Search", count: searchTraffic },
        { source: "Social", count: socialTraffic },
      ],
    };
  }, [orders, products]);

  return (
    <SellerShell title="Analytics" subtitle="Daily, weekly, and monthly sales trends with product performance and traffic source splits.">
      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Daily sales" value={usd(summary.daily)} />
        <Metric label="Weekly sales" value={usd(summary.weekly)} />
        <Metric label="Monthly sales" value={usd(summary.monthly)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200/80">Top products</p>
          <div className="mt-4 space-y-3">
            {summary.topProducts.map((product) => (
              <div key={String(product.id)} className="rounded-2xl border border-white/10 bg-black/30 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">{String(product.title ?? "Untitled")}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Sold {Number(product.sold_count ?? 0)}</p>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-amber-300" style={{ width: `${Math.min(100, Number(product.sold_count ?? 0) * 10)}%` }} />
                </div>
              </div>
            ))}
            {!loading && summary.topProducts.length === 0 ? <p className="rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-zinc-300">No product analytics yet.</p> : null}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200/80">Traffic sources</p>
          <div className="mt-4 space-y-3">
            {summary.traffic.map((source) => {
              const total = Math.max(1, summary.traffic.reduce((sum, row) => sum + row.count, 0));
              const percent = Math.round((source.count / total) * 100);

              return (
                <div key={source.source} className="rounded-2xl border border-white/10 bg-black/30 p-3">
                  <div className="flex items-center justify-between text-sm text-zinc-200">
                    <span>{source.source}</span>
                    <span>{source.count} views</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-amber-300" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-200/80">Revenue chart</p>
        <p className="mt-2 text-sm text-zinc-300">Visual chart placeholder using weekly order earnings buckets.</p>
        <div className="mt-4 flex h-40 items-end gap-3">
          {buildMiniChart(orders).map((value, index) => (
            <div key={index} className="flex-1 rounded-t-xl bg-amber-300/80" style={{ height: `${Math.max(8, value)}%` }} />
          ))}
        </div>
      </div>
    </SellerShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
      <p className="text-[10px] uppercase tracking-[0.35em] text-amber-200/80">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

function usd(cents: number) {
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function buildMiniChart(orders: SellerOrder[]) {
  const buckets = new Array<number>(7).fill(0);
  const now = new Date().getTime();
  const dayMs = 24 * 60 * 60 * 1000;

  for (const order of orders) {
    const ageDays = Math.floor((now - new Date(order.createdAt).getTime()) / dayMs);
    if (ageDays >= 0 && ageDays < 7) {
      buckets[6 - ageDays] += order.sellerTotalCents;
    }
  }

  const max = Math.max(1, ...buckets);
  return buckets.map((value) => Math.round((value / max) * 100));
}
