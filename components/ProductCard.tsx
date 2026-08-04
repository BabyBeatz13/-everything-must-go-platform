import type { Product } from "../types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[0_18px_60px_rgba(0,0,0,0.48)] transition duration-300 hover:-translate-y-1 hover:border-amber-300/40 hover:bg-white/[0.06]">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-full border border-amber-300/35 bg-black/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-amber-100">
          {product.category}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-amber-200/75">{product.merchant}</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{product.name}</h3>
          </div>
          <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.26em] text-amber-100">
            {product.rating.toFixed(1)}★
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-zinc-300">{product.description}</p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-zinc-400">Brand</p>
            <p className="mt-1 text-sm font-semibold text-white">{product.brand}</p>
          </div>
          <span className="text-xl font-semibold text-amber-300">${product.price.toFixed(2)}</span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.26em] ${product.inStock ? "border border-emerald-300/45 bg-emerald-300/10 text-emerald-100" : "border border-rose-300/45 bg-rose-300/10 text-rose-100"}`}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
          <span className="text-[10px] uppercase tracking-[0.26em] text-zinc-400">
            {product.featured ? "Featured" : "Curated"}
          </span>
        </div>

        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-amber-300 px-4 py-3 text-sm font-bold uppercase tracking-[0.28em] text-black transition hover:scale-[1.01]"
        >
          Buy Now
        </a>
      </div>
    </article>
  );
}
