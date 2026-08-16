"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MarketplaceProductCard } from "@/components/MarketplaceProductCard";
import { getMarketplaceProducts, type MarketplaceProductCardView } from "@/lib/marketplace";

export default function SearchResultsContent() {
  const params = useSearchParams();
  const rawQuery = params.get("q") ?? "";
  const rawSort = params.get("sort") ?? "relevance";
  const rawCategory = params.get("category") ?? "";
  const rawBrand = params.get("brand") ?? "";
  const rawCondition = params.get("condition") ?? "";
  const [products, setProducts] = useState<MarketplaceProductCardView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        const results = await getMarketplaceProducts({
          search: rawQuery || undefined,
          sort: rawSort as "relevance" | "newest" | "oldest" | "price_asc" | "price_desc",
          category: rawCategory || undefined,
          brand: rawBrand || undefined,
          condition: rawCondition || undefined,
        });
        setProducts(results);
      } catch {
        setProducts([]);
      }
      setLoading(false);
    })();
  }, [rawQuery, rawSort, rawCategory, rawBrand, rawCondition]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const product of products) {
      if (product.category) set.add(product.category);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const brands = useMemo(() => {
    const set = new Set<string>();
    for (const product of products) {
      if (product.brand) set.add(product.brand);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const conditions = useMemo(() => {
    const set = new Set<string>();
    for (const product of products) {
      if (product.condition) set.add(product.condition);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const buildFilterHref = (key: "sort" | "category" | "brand" | "condition", value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    return `/search?${next.toString()}`;
  };

  const summary = useMemo(() => {
    if (!rawQuery) return "Browse all premium finds";
    return `Results for “${rawQuery}”`;
  }, [rawQuery]);

  const isCubanQuery = useMemo(() => {
    const value = rawQuery.trim().toLowerCase();
    return [
      "cuban link",
      "cuban links",
      "cuban chain",
      "cuban chains",
      "miami cuban",
      "miami cuban link",
      "gold cuban link",
      "diamond cuban link",
      "iced cuban link",
      "men's cuban link",
      "womens cuban link",
      "women's cuban link",
    ].some((term) => value.includes(term));
  }, [rawQuery]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Marketplace search</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">{summary}</h1>
            {!loading ? <p className="mt-2 text-sm text-zinc-400">{products.length} result{products.length === 1 ? "" : "s"}</p> : null}
          </div>
          <Link href="/" className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200">
            Back to home
          </Link>
        </div>

        <div className="mb-6 grid gap-3 md:grid-cols-4">
          <Link href={buildFilterHref("sort", "relevance")} className={`rounded-2xl border px-3 py-2 text-sm ${rawSort === "relevance" ? "border-amber-300/50 bg-amber-300/10 text-amber-100" : "border-white/10 bg-white/[0.03] text-zinc-200"}`}>Most Relevant</Link>
          <Link href={buildFilterHref("sort", "newest")} className={`rounded-2xl border px-3 py-2 text-sm ${rawSort === "newest" ? "border-amber-300/50 bg-amber-300/10 text-amber-100" : "border-white/10 bg-white/[0.03] text-zinc-200"}`}>Newest</Link>
          <Link href={buildFilterHref("sort", "oldest")} className={`rounded-2xl border px-3 py-2 text-sm ${rawSort === "oldest" ? "border-amber-300/50 bg-amber-300/10 text-amber-100" : "border-white/10 bg-white/[0.03] text-zinc-200"}`}>Oldest</Link>
          <Link href={buildFilterHref("sort", "price_asc")} className={`rounded-2xl border px-3 py-2 text-sm ${rawSort === "price_asc" ? "border-amber-300/50 bg-amber-300/10 text-amber-100" : "border-white/10 bg-white/[0.03] text-zinc-200"}`}>Price Low to High</Link>
          <Link href={buildFilterHref("sort", "price_desc")} className={`rounded-2xl border px-3 py-2 text-sm ${rawSort === "price_desc" ? "border-amber-300/50 bg-amber-300/10 text-amber-100" : "border-white/10 bg-white/[0.03] text-zinc-200"}`}>Price High to Low</Link>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
            <p className="mb-1 text-[10px] uppercase tracking-[0.24em] text-zinc-400">Category</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <Link href={buildFilterHref("category", "")} className={rawCategory ? "text-zinc-300" : "text-amber-200"}>All</Link>
              {categories.slice(0, 8).map((category) => (
                <Link key={category} href={buildFilterHref("category", category)} className={rawCategory === category ? "text-amber-200" : "text-zinc-300"}>{category}</Link>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
            <p className="mb-1 text-[10px] uppercase tracking-[0.24em] text-zinc-400">Brand</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <Link href={buildFilterHref("brand", "")} className={rawBrand ? "text-zinc-300" : "text-amber-200"}>All</Link>
              {brands.slice(0, 8).map((brand) => (
                <Link key={brand} href={buildFilterHref("brand", brand)} className={rawBrand === brand ? "text-amber-200" : "text-zinc-300"}>{brand}</Link>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
            <p className="mb-1 text-[10px] uppercase tracking-[0.24em] text-zinc-400">Condition</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <Link href={buildFilterHref("condition", "")} className={rawCondition ? "text-zinc-300" : "text-amber-200"}>All</Link>
              {conditions.slice(0, 8).map((condition) => (
                <Link key={condition} href={buildFilterHref("condition", condition)} className={rawCondition === condition ? "text-amber-200" : "text-zinc-300"}>{condition}</Link>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-sm uppercase tracking-[0.35em] text-amber-100">Loading results...</p>
        ) : products.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-8 text-center text-zinc-300">
            No products matched this search yet. Try a broader keyword or another category.
            {isCubanQuery ? (
              <p className="mt-3 text-sm text-amber-100">
                No exact Cuban Link listings are live right now. Explore <Link href="/category/jewelry" className="font-semibold text-amber-200 underline">Jewelry</Link> for related items.
              </p>
            ) : null}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <MarketplaceProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
