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
    title: "Fitness",
    subtitle: "Gym Equipment • Black Seed Oil",
    accent: "from-emerald-300/20 to-lime-500/15",
  },
  {
    title: "Home",
    subtitle: "Luxury Furniture • California King Beds",
    accent: "from-orange-300/20 to-yellow-500/15",
  },
  {
    title: "Studio",
    subtitle: "Sweetwater • Universal Audio • Microphones",
    accent: "from-sky-300/20 to-cyan-500/15",
  },
];

const flashDeals = [
  {
    name: "MacBook Pro M4",
    category: "Electronics",
    price: "$2,499",
    discount: "18% off",
  },
  {
    name: "North Face Summit Shell",
    category: "Fashion",
    price: "$289",
    discount: "25% off",
  },
  {
    name: "Lace Front Wig Signature",
    category: "Beauty",
    price: "$349",
    discount: "12% off",
  },
  {
    name: "Focusrite Scarlett 4i4",
    category: "Studio",
    price: "$229",
    discount: "20% off",
  },
];

const bestSellers = [
  {
    name: "Galaxy S25 Ultra",
    tag: "Premium Tech",
    price: "$1,299",
    badge: "Top Rated",
  },
  {
    name: "Authentic Kobe Jersey",
    tag: "Collector Drop",
    price: "$480",
    badge: "Limited",
  },
  {
    name: "Black Seed Oil Bundle",
    tag: "Wellness",
    price: "$79",
    badge: "Best Value",
  },
  {
    name: "California King Bed Frame",
    tag: "Luxury Home",
    price: "$899",
    badge: "Editor Pick",
  },
];

const newArrivals = [
  {
    name: "AirPods Max Luxe",
    tag: "Audio",
    price: "$549",
  },
  {
    name: "Sweetwater Studio Kit",
    tag: "Creator Gear",
    price: "$1,199",
  },
  {
    name: "Ashwagandha Complex",
    tag: "Fitness",
    price: "$64",
  },
  {
    name: "Helly Hansen Shell Jacket",
    tag: "Outdoor",
    price: "$215",
  },
];

const brands = [
  "Apple",
  "Samsung",
  "North Face",
  "Pelle Pelle",
  "Sweetwater",
  "Universal Audio",
  "Focusrite",
  "GOAT",
];

const departmentLinks = [
  "Electronics",
  "Apple",
  "Samsung",
  "Unlocked Phones",
  "MacBooks",
  "iPads",
  "AirPods",
  "Fashion",
  "Pelle Pelle",
  "North Face",
  "Helly Hansen",
  "Authentic Jerseys",
  "GOAT",
  "StockX",
  "Beauty",
  "Human Hair Wigs",
  "Lace Front Wigs",
  "Fitness",
  "Gym Equipment",
  "Black Seed Oil",
  "Ashwagandha",
  "Home",
  "Luxury Furniture",
  "California King Beds",
  "Studio",
  "Sweetwater",
  "Waves",
  "Antares",
  "Focusrite",
  "Universal Audio",
  "Microphones",
  "Studio Monitors",
  "Pet Supplies",
  "Gaming",
  "Home Improvement",
  "Adult Wellness",
];

const testimonials = [
  {
    quote:
      "Luxury-grade shopping experience. Everything Must Go makes premium finds feel effortless.",
    name: "Mila Carter",
  },
  {
    quote:
      "The curated collections are unmatched. I found my latest studio setup in one smooth checkout.",
    name: "Jordan Reed",
  },
  {
    quote:
      "Elegant, premium, and fast. The site design matches the exclusivity of the products.",
    name: "Avery Brooks",
  },
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

function ProductCard({
  name,
  tag,
  price,
  badge,
}: {
  name: string;
  tag: string;
  price: string;
  badge?: string;
}) {
  return (
    <article className="group rounded-[28px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition duration-300 hover:-translate-y-1 hover:border-amber-300/40 hover:bg-white/[0.06]">
      <div className="mb-4 rounded-[22px] bg-[radial-gradient(circle_at_top,_rgba(244,198,97,0.45),_rgba(255,255,255,0.03)_42%,_rgba(0,0,0,0.15)_75%)] p-8 text-center text-5xl text-amber-100/70">
        {name.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200/75">{tag}</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{name}</h3>
        </div>
        <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-amber-100">
          {badge ?? "New"}
        </span>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <span className="text-xl font-semibold text-amber-300">{price}</span>
        <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white transition hover:border-amber-300/50 hover:bg-amber-300/10">
          Add to bag
        </button>
      </div>
    </article>
  );
}

export default function Home() {
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
            <a className="transition hover:text-amber-200" href="#featured">Featured</a>
            <a className="transition hover:text-amber-200" href="#deals">Flash Deals</a>
            <a className="transition hover:text-amber-200" href="#best">Best Sellers</a>
            <a className="transition hover:text-amber-200" href="#brands">Brands</a>
            <a className="transition hover:text-amber-200" href="#reviews">Reviews</a>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-zinc-300 sm:flex">
              <SearchIcon />
              <input
                className="w-40 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                placeholder="Search luxury picks"
              />
            </div>
            <button className="rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/20">
              Login
            </button>
            <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-amber-100 transition hover:border-amber-300/50 hover:bg-amber-300/10">
              <CartIcon />
            </button>
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
              Discover limited-edition fashion, elite audio, wellness essentials, and premium home finds.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-full bg-amber-300 px-5 py-3 text-sm font-bold uppercase tracking-[0.25em] text-black transition hover:scale-[1.02]">
                Shop featured
              </button>
              <button className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold uppercase tracking-[0.25em] text-white transition hover:border-amber-300/50">
                Explore categories
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-[10px] uppercase tracking-[0.35em] text-amber-200/80">Signature Arrival</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Studio Essentials</h3>
            <p className="mt-2 text-sm text-zinc-300">Focusrite, Universal Audio, Sweetwater, and premium mic kits.</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-[10px] uppercase tracking-[0.35em] text-amber-200/80">New Collector</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">High-Value Finds</h3>
            <p className="mt-2 text-sm text-zinc-300">Black seed oil, ashwagandha, luxury furniture, and wellness bundles.</p>
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
            <article
              key={category.title}
              className={`rounded-[28px] border border-white/10 bg-gradient-to-br ${category.accent} p-5 transition duration-300 hover:-translate-y-1 hover:border-amber-300/50`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">{category.title}</h3>
                <span className="rounded-full border border-amber-300/30 bg-black/30 px-2.5 py-1 text-[10px] uppercase tracking-[0.3em] text-amber-100">
                  Trending
                </span>
              </div>
              <p className="mt-4 text-sm text-zinc-300">{category.subtitle}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.4em] text-amber-200/80">Browse Collections</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Full marketplace catalog</h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {departmentLinks.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition hover:border-amber-300/40 hover:text-amber-100"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="deals" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-amber-200/80">Flash Deals</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Act before it fades</h2>
          </div>
          <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-100">
            Limited time
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {flashDeals.map((deal) => (
            <article key={deal.name} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-amber-300/50">
              <div className="mb-4 rounded-[22px] bg-[linear-gradient(135deg,rgba(244,198,97,0.28),rgba(255,255,255,0.02))] p-8 text-center text-4xl text-amber-100/80">
                {deal.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-[0.26em] text-amber-200/80">{deal.category}</span>
                <span className="rounded-full bg-amber-300/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-amber-100">
                  {deal.discount}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-white">{deal.name}</h3>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xl font-semibold text-amber-300">{deal.price}</span>
                <button className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white">
                  Buy now
                </button>
              </div>
            </article>
          ))}
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
            <ProductCard key={product.name} {...product} />
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
            <ProductCard key={product.name} {...product} badge="New" />
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

      <section id="reviews" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-200/80">Customer Reviews</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">What premium shoppers are saying</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((review) => (
            <article key={review.name} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-4 flex gap-1 text-amber-300">★★★★★</div>
              <p className="text-base leading-7 text-zinc-200">“{review.quote}”</p>
              <div className="mt-4 text-sm font-semibold uppercase tracking-[0.26em] text-amber-100">{review.name}</div>
            </article>
          ))}
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
              <li>Electronics</li>
              <li>Fashion</li>
              <li>Beauty</li>
              <li>Fitness</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white">Collections</h3>
            <ul className="mt-3 space-y-2">
              <li>Studio</li>
              <li>Gaming</li>
              <li>Home</li>
              <li>Pet Supplies</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white">Support</h3>
            <ul className="mt-3 space-y-2">
              <li>Shipping & Returns</li>
              <li>Contact Concierge</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}
