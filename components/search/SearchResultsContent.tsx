"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MarketplaceProductCard } from "@/components/MarketplaceProductCard";
import { getMarketplaceProducts, type MarketplaceProductCardView } from "@/lib/marketplace";

export default function SearchResultsContent() {
  const params = useSearchParams();
  const rawQuery = params.get("q") ?? "";
  const [products, setProducts] = useState<MarketplaceProductCardView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        const results = await getMarketplaceProducts({ search: rawQuery || undefined });
        setProducts(results);
      } catch {
        setProducts([]);
      }
      setLoading(false);
    })();
  }, [rawQuery]);

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
