import Link from "next/link";
import { getSellerProducts } from "@/lib/marketplace";

export default async function SellerProductsPage() {
  const products = await getSellerProducts("demo-seller-1");

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 rounded-[30px] border border-amber-300/20 bg-white/[0.03] p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Seller inventory</p>
            <h1 className="mt-2 text-3xl font-semibold">Marketplace products</h1>
          </div>
          <Link href="/seller/products/new" className="rounded-full bg-amber-300 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.2em] text-black">
            Add product
          </Link>
        </div>

        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={product.product_images?.[0] ?? "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80"}
                    alt={product.title}
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                  <div>
                    <p className="text-lg font-semibold text-white">{product.title}</p>
                    <p className="text-sm text-zinc-300">{product.category} • {product.brand}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.25em] text-zinc-500">{product.status}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-amber-300/35 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-100">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-200">
                    {product.inventory_quantity} in stock
                  </span>
                  <Link href={`/seller/products/${product.id}/edit`} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white">
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
