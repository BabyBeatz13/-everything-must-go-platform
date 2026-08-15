import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.6)] sm:p-10">
          <p className="text-[10px] uppercase tracking-[0.4em] text-amber-200/80">404</p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Looks like this item got away.</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-zinc-300">
            The page you were looking for may have moved, expired, or never existed. Explore the marketplace below to find your next luxury find.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/search" className="rounded-full bg-amber-300 px-5 py-3 text-sm font-bold uppercase tracking-[0.24em] text-black transition hover:scale-[1.02]">
              Search Everything Must Go
            </Link>
            <Link href="/" className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold uppercase tracking-[0.24em] text-white transition hover:border-amber-300/40 hover:text-amber-100">
              Return home
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/category/electronics", label: "Electronics" },
              { href: "/category/fashion", label: "Fashion" },
              { href: "/category/beauty", label: "Beauty" },
              { href: "/category/fragrance", label: "Fragrance" },
              { href: "/category/home", label: "Home" },
              { href: "/category/jewelry", label: "Jewelry" },
              { href: "/category/vintage-gaming", label: "Vintage Gaming" },
              { href: "/category/collectibles", label: "Collectibles" },
              { href: "/category/studio", label: "Studio" },
              { href: "/support", label: "Support" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[22px] border border-white/10 bg-black/20 px-4 py-4 text-sm font-semibold text-zinc-200 transition hover:border-amber-300/40 hover:text-amber-100"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
