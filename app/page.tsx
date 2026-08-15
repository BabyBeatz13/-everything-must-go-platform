"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductCard } from "../components/ProductCard";
import { MarketplaceProductCard } from "../components/MarketplaceProductCard";
import { UserMenu } from "../components/account/UserMenu";
import { getCartCountSync, subscribeToCartUpdates } from "../lib/cart";
import { getMarketplaceProducts } from "../lib/marketplace";
import { products } from "../data/products";
import type { ProductCategory } from "../types/product";

const featuredCategories = [
  {
    title: "Electronics",
    subtitle: "Apple • Samsung • AirPods",
    accent: "from-amber-300/25 to-yellow-600/10",
  },
  {
    title: "Fashion",
    subtitle: "Pelle Pelle • GOAT • StockX",
    accent: "from-zinc-300/20 to-stone-500/15",
  },
  {
    title: "Beauty",
    subtitle: "Human Hair Wigs • Lace Front",
    accent: "from-rose-300/20 to-amber-200/15",
  },
  {
    title: "Fragrance",
    subtitle: "Cologne • Perfume • Luxury scents",
    accent: "from-fuchsia-300/20 to-rose-500/15",
  },
  {
    title: "Fitness",
    subtitle: "Strength • Conditioning • Home Training",
    accent: "from-emerald-300/20 to-lime-500/15",
  },
  {
    title: "Home",
    subtitle: "Luxury Furniture • California King Beds",
    accent: "from-orange-300/20 to-yellow-500/15",
  },
  {
    title: "Jewelry",
    subtitle: "Fine Jewelry • Gold Chains • Diamond Pieces",
    accent: "from-amber-200/20 to-yellow-500/15",
  },
  {
    title: "Vintage Gaming",
    subtitle: "Retro consoles • classic titles • collector gear",
    accent: "from-violet-300/20 to-purple-500/15",
  },
  {
    title: "Collectibles",
    subtitle: "Trading cards • memorabilia • rare drops",
    accent: "from-cyan-300/20 to-sky-500/15",
  },
  {
    title: "Studio",
    subtitle: "Sweetwater • Universal Audio • Microphones",
    accent: "from-sky-300/20 to-cyan-500/15",
  },
];

const brands = [
  "Apple",
  "Samsung",
  "Pelle Pelle",
  "Aurelia Fine",
  "Jo Malone",
  "Guerlain",
  "Sweetwater",
  "Focusrite",
  "Universal Audio",
];

const departmentLinks = [
  "Electronics",
  "Fashion",
  "Beauty",
  "Fragrance",
  "Fitness",
  "Home",
  "Jewelry",
  "Vintage Gaming",
  "Collectibles",
  "Studio",
  "Pet Supplies",
  "Health",
];

const allCategories: Array<"All" | ProductCategory> = [
  "All",
  "Electronics",
  "Fashion",
  "Beauty",
  "Fragrance",
  "Fitness",
  "Home",
  "Jewelry",
  "Vintage Gaming",
  "Collectibles",
  "Studio",
  "Pet Supplies",
  "Health",
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 5 5" strokeLinecap="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 5h2l1.6 8.5a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 8H7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="19" r="1.3" />
      <circle cx="17" cy="19" r="1.3" />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<"All" | ProductCategory>("All");
  const [marketplaceSearch, setMarketplaceSearch] = useState("");
  const [liveMarketplaceProducts, setLiveMarketplaceProducts] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);

  const handleMarketplaceSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = marketplaceSearch.trim();
    if (!trimmedQuery) return;
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  useEffect(() => {
    void (async () => {
      try {
        const products = await getMarketplaceProducts({
          category: selectedCategory === "All" ? undefined : selectedCategory,
          search: marketplaceSearch || undefined,
        });
        setLiveMarketplaceProducts(products);
      } catch {
        setLiveMarketplaceProducts([]);
      }
    })();
  }, [selectedCategory, marketplaceSearch]);

  useEffect(() => {
    setCartCount(getCartCountSync());
    return subscribeToCartUpdates(() => {
      setCartCount(getCartCountSync());
    });
  }, []);

  const filteredProducts = useMemo(() => {
    return selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  const featuredProducts = filteredProducts.filter((product) => product.featured).slice(0, 8);
  const bestSellers = filteredProducts.slice(0, 4);
  const newArrivals = filteredProducts.slice(8, 12);
  const marketplaceFeatured = liveMarketplaceProducts.filter((product) => product.featured && product.sourceType === "seller").slice(0, 4);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <header className="sticky top-0 z-50 border-b border-white/8 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-300/40 bg-gradient-to-br from-amber-200/95 to-amber-500/40 text-[11px] font-black tracking-[0.25em] text-black">
              EMG
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.45em] text-amber-200/80">Everything Must Go</p>
              <h1 className="text-base font-semibold tracking-[0.22em] text-white">Luxury Market</h1>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-zinc-300 lg:flex">
            <Link className="transition hover:text-amber-200" href="/search?q=featured">Featured</Link>
            <Link className="transition hover:text-amber-200" href="/search">Catalog</Link>
            <Link className="transition hover:text-amber-200" href="/search?q=best+sellers">Best Sellers</Link>
            <Link className="transition hover:text-amber-200" href="/search?q=brands">Brands</Link>
            <Link className="transition hover:text-amber-200" href="/help">Reviews Policy</Link>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <form onSubmit={handleMarketplaceSearch} className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-zinc-300 sm:flex">
              <button type="submit" aria-label="Search marketplace" className="flex items-center justify-center text-zinc-300 transition hover:text-amber-200">
                <SearchIcon />
              </button>
              <input
                className="w-40 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                placeholder="Search luxury picks"
                value={marketplaceSearch}
                onChange={(event) => setMarketplaceSearch(event.target.value)}
              />
            </form>
            <UserMenu />
            <Link href="/cart" className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-amber-100 transition hover:border-amber-300/50 hover:bg-amber-300/10">
              <CartIcon />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-amber-300 px-1.5 py-0.5 text-center text-[10px] font-bold text-black">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-10">
        <div className="overflow-hidden rounded-[32px] border border-amber-300/20 bg-[linear-gradient(135deg,rgba(244,198,97,0.2),rgba(20,20,20,0.95)_60%)] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.55)] sm:p-10">
          <div className="max-w-xl">
            <span className="inline-flex rounded-full border border-amber-300/30 bg-black/35 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.38em] text-amber-100">
              Summer Luxe Drop
            </span>
            <h2 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Curated indulgence for the modern collector.
            </h2>
            <p className="mt-4 max-w-lg text-base text-zinc-300 sm:text-lg">
              Discover luxury affiliate picks across electronics, fashion, beauty, home, fitness, and studio equipment.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/search?sort=newest"
                className="rounded-full bg-amber-300 px-5 py-3 text-sm font-bold uppercase tracking-[0.25em] text-black transition hover:scale-[1.02]"
              >
                Shop featured
              </Link>
              <Link
                href="/search?q=brand"
                className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold uppercase tracking-[0.25em] text-white transition hover:border-amber-300/50"
              >
                Explore brands
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-[10px] uppercase tracking-[0.35em] text-amber-200/80">Signature Arrival</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Studio Essentials</h3>
            <p className="mt-2 text-sm text-zinc-300">Focusrite, Universal Audio, and premium mic suites from trusted merchants.</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-[10px] uppercase tracking-[0.35em] text-amber-200/80">New Collector</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">High-Value Finds</h3>
            <p className="mt-2 text-sm text-zinc-300">Luxury furniture, wellness bundles, and curated accessories with merchant-grade curation.</p>
          </div>
        </div>
      </section>

      <section id="featured" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-amber-200/80">Featured Categories</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Shop by lifestyle</h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCategories.map((category) => (
            <Link
              key={category.title}
              href={`/category/${category.title.toLowerCase().replace(/\s+/g, "-")}`}
              className={`block rounded-[28px] border border-white/10 bg-gradient-to-br ${category.accent} p-5 transition duration-300 hover:-translate-y-1 hover:border-amber-300/50`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">{category.title}</h3>
                <span className="rounded-full border border-amber-300/30 bg-black/30 px-2.5 py-1 text-[10px] uppercase tracking-[0.3em] text-amber-100">
                  Trending
                </span>
              </div>
              <p className="mt-4 text-sm text-zinc-300">{category.subtitle}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="catalog" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-amber-200/80">Affiliate Marketplace</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Featured product catalog</h2>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2.5">
          {allCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.28em] transition ${
                selectedCategory === category
                  ? "border-amber-300/55 bg-amber-300 text-black"
                  : "border-white/10 bg-white/[0.04] text-zinc-200 hover:border-amber-300/40 hover:text-amber-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-amber-200/80">Seller Marketplace</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Live seller spotlight</h2>
          </div>
          <Link href="/cart" className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-zinc-200 hover:border-amber-300/40 hover:text-amber-100">
            Go to cart
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {marketplaceFeatured.map((product) => (
            <MarketplaceProductCard key={product.id} product={product} />
          ))}
        </div>
        {marketplaceFeatured.length === 0 ? (
          <div className="mt-4 rounded-[20px] border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-300">
            Seller spotlight is currently empty. Browse affiliate catalog items in search while seller inventory is being refreshed.
          </div>
        ) : null}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.4em] text-amber-200/80">Browse Collections</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Full marketplace catalog</h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {departmentLinks.map((item) => {
              const href = item === "Jewelry" ? "/category/jewelry" : `/category/${item.toLowerCase().replace(/\s+/g, "-")}`;

              return (
                <Link
                  key={item}
                  href={href}
                  className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition hover:border-amber-300/40 hover:text-amber-100"
                >
                  {item}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="best" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-amber-200/80">Best Sellers</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Top picks with prestige</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-amber-200/80">New Arrivals</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Freshly dropped</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section id="brands" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-amber-300/25 bg-[linear-gradient(135deg,rgba(244,198,97,0.12),rgba(255,255,255,0.03))] p-6 sm:p-8">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.4em] text-amber-200/80">Premium Brands</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Names the elite trust</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {brands.map((brand) => (
              <div
                key={brand}
                className="rounded-[22px] border border-white/10 bg-black/25 px-4 py-5 text-center text-base font-semibold text-white/90 transition hover:border-amber-300/40 hover:text-amber-100"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(244,198,97,0.12),rgba(20,20,20,0.9))] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-amber-200/80">Newsletter Signup</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Join the private list</h2>
              <p className="mt-3 text-zinc-300">
                Access launch-day drops, influencer bundles, and member-only sales every week.
              </p>
            </div>
            <form className="flex flex-col gap-3 sm:flex-row">
              <input
                className="flex-1 rounded-full border border-white/10 bg-black/30 px-5 py-3 text-white outline-none placeholder:text-zinc-500"
                placeholder="Enter your email"
              />
              <button className="rounded-full bg-amber-300 px-5 py-3 text-sm font-bold uppercase tracking-[0.28em] text-black transition hover:scale-[1.02]">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-200/80">Customer Reviews</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Verified purchaser reviews coming soon</h2>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 text-zinc-300">
          Customer testimonial cards are hidden until verified shopper reviews are available.
        </div>
      </section>

      <footer className="border-t border-white/8 bg-black/60">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-zinc-400 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Everything Must Go</p>
            <p className="mt-3 max-w-xs">The luxury marketplace for rare finds, elite tech, wellness, and collector-grade essentials.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white">Explore</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/category/electronics" className="inline-block rounded-md px-1 py-1 text-zinc-400 transition hover:text-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60">Electronics</Link></li>
              <li><Link href="/category/fashion" className="inline-block rounded-md px-1 py-1 text-zinc-400 transition hover:text-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60">Fashion</Link></li>
              <li><Link href="/category/beauty" className="inline-block rounded-md px-1 py-1 text-zinc-400 transition hover:text-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60">Beauty</Link></li>
              <li><Link href="/category/fitness" className="inline-block rounded-md px-1 py-1 text-zinc-400 transition hover:text-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60">Fitness</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white">Collections</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/category/fragrance" className="inline-block rounded-md px-1 py-1 text-zinc-400 transition hover:text-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60">Fragrance</Link></li>
              <li><Link href="/category/studio" className="inline-block rounded-md px-1 py-1 text-zinc-400 transition hover:text-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60">Studio</Link></li>
              <li><Link href="/category/vintage-gaming" className="inline-block rounded-md px-1 py-1 text-zinc-400 transition hover:text-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60">Vintage Gaming</Link></li>
              <li><Link href="/category/collectibles" className="inline-block rounded-md px-1 py-1 text-zinc-400 transition hover:text-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60">Collectibles</Link></li>
              <li><Link href="/category/pet-supplies" className="inline-block rounded-md px-1 py-1 text-zinc-400 transition hover:text-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60">Pet Supplies</Link></li>
              <li><Link href="/category/home" className="inline-block rounded-md px-1 py-1 text-zinc-400 transition hover:text-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60">Home</Link></li>
              <li><Link href="/category/jewelry" className="inline-block rounded-md px-1 py-1 text-zinc-400 transition hover:text-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60">Jewelry</Link></li>
              <li><Link href="/category/health" className="inline-block rounded-md px-1 py-1 text-zinc-400 transition hover:text-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60">Health</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white">Support</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/legal/shipping" className="inline-block rounded-md px-1 py-1 text-zinc-400 transition hover:text-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60">Shipping &amp; Returns</Link></li>
              <li><Link href="/support" className="inline-block rounded-md px-1 py-1 text-zinc-400 transition hover:text-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60">Contact Concierge</Link></li>
              <li><Link href="/legal/terms" className="inline-block rounded-md px-1 py-1 text-zinc-400 transition hover:text-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60">Terms of Service</Link></li>
              <li><Link href="/legal/privacy" className="inline-block rounded-md px-1 py-1 text-zinc-400 transition hover:text-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}
