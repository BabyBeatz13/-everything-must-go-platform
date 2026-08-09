"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SellerShell } from "@/components/seller/SellerShell";
import { getSellerProductsPortal } from "@/lib/seller-portal";

const statusFilters = ["all", "draft", "active", "paused", "archived"] as const;

export default function SellerProductsPage() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<(typeof statusFilters)[number]>("all");
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    void (async () => {
      const rows = await getSellerProductsPortal();
      setProducts(rows);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((row) => {
      const matchesStatus = status === "all" || String(row.status) === status;
      const matchesQuery = String(row.title ?? "").toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [products, query, status]);

  return (
    <SellerShell
      title="Product management"
      subtitle="Create, publish, pause, and optimize listings with inventory and SEO controls."
      rightSlot={
        <Link href="/seller/products/new" className="rounded-full bg-amber-300 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.2em] text-black">
          Add product
        </Link>
      }
    >
      <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title"
            className="w-full rounded-full border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none md:max-w-sm"
          />
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setStatus(option)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${status === option ? "border border-amber-300/45 bg-amber-300/15 text-amber-100" : "border border-white/10 bg-black/30 text-zinc-300"}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((product) => (
          <div key={String(product.id)} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={Array.isArray(product.product_images) ? String(product.product_images[0] ?? "") : "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80"}
                  alt={String(product.title ?? "Product")}
                  className="h-20 w-20 rounded-2xl object-cover"
                />
                <div>
                  <p className="text-lg font-semibold text-white">{String(product.title ?? "Untitled product")}</p>
                  <p className="text-sm text-zinc-300">{String(product.category ?? "Uncategorized")} • {String(product.brand ?? "No brand")}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.25em] text-zinc-500">{String(product.status ?? "draft")}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-amber-300/35 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-100">
                  ${Number(product.price ?? 0).toFixed(2)}
                </span>
                <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-200">
                  {Number(product.inventory_quantity ?? 0)} in stock
                </span>
                <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-200">
                  {Number(product.view_count ?? 0)} views
                </span>
                <Link href={`/seller/products/${String(product.id)}/edit`} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white">
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}

        {loading ? <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-zinc-300">Loading products...</p> : null}
        {!loading && filtered.length === 0 ? <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-zinc-300">No products match your filters.</p> : null}
      </div>
    </SellerShell>
  );
}
