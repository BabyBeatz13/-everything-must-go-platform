import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketplaceProductCard } from "@/components/MarketplaceProductCard";
import { getMarketplaceProducts } from "@/lib/marketplace";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categoryKey = decodeURIComponent(slug).toLowerCase();
  const categoryName = categoryKey
    .replace(/-/g, " ")
    .replace(/\band\b/g, "&")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const products = await getMarketplaceProducts({ category: categoryName });

  if (!products.length) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-8 text-center">
            <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Category</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">{categoryName}</h1>
            <p className="mt-3 text-xl font-semibold text-amber-100">0 {categoryName} listings</p>
            <p className="mt-4 text-zinc-300">No current listings in this category.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/search" className="rounded-full bg-amber-300 px-5 py-3 text-sm font-bold uppercase tracking-[0.24em] text-black">Search everything</Link>
              <Link href="/" className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold uppercase tracking-[0.24em] text-white">Return home</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Category</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">{categoryName}</h1>
          </div>
          <Link href="/" className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200">
            Back to home
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <MarketplaceProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
