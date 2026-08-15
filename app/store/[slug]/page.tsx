import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketplaceProductCard } from "@/components/MarketplaceProductCard";
import { getMarketplaceProducts } from "@/lib/marketplace";

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const storeName = decodeURIComponent(slug).replace(/-/g, " ");
  const products = (await getMarketplaceProducts()).filter((product) => product.storeName.toLowerCase().replace(/\s+/g, "-") === storeName.toLowerCase().replace(/\s+/g, "-"));

  if (!products.length) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Seller storefront</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">{storeName}</h1>
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
