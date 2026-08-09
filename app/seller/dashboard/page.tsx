import Link from "next/link";
import { MarketplaceCard } from "@/components/marketplace/MarketplaceCard";
import { StatusBadge } from "@/components/marketplace/StatusBadge";
import { sellerProfileData, sellerProductCatalog } from "@/lib/marketplace-data";

export default function SellerDashboardPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[30px] border border-amber-300/20 bg-white/[0.03] p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Seller dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold">{sellerProfileData.storeName}</h1>
            </div>
            <StatusBadge status={sellerProfileData.status} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"><p className="text-[10px] uppercase tracking-[0.35em] text-amber-200/80">Listings</p><p className="mt-3 text-3xl font-semibold">{sellerProductCatalog.length}</p></div>
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"><p className="text-[10px] uppercase tracking-[0.35em] text-amber-200/80">Inventory</p><p className="mt-3 text-3xl font-semibold">{sellerProductCatalog.reduce((sum, item) => sum + item.inventoryQuantity, 0)}</p></div>
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"><p className="text-[10px] uppercase tracking-[0.35em] text-amber-200/80">Featured</p><p className="mt-3 text-3xl font-semibold">{sellerProductCatalog.filter((item) => item.featured).length}</p></div>
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"><p className="text-[10px] uppercase tracking-[0.35em] text-amber-200/80">Sales</p><p className="mt-3 text-3xl font-semibold">$18.4K</p></div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <MarketplaceCard title="Inventory management" description="Review active listings, inventory counts, pricing, and shipping settings.">
            <div className="space-y-3">
              {sellerProductCatalog.map((product) => (
                <div key={product.id} className="rounded-[22px] border border-white/10 bg-black/25 p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-white">{product.title}</p>
                      <p className="mt-1 text-sm text-zinc-300">{product.category} • {product.condition}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={product.status} />
                      <Link href={`/seller/products/${product.id}/edit`} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                        Edit
                      </Link>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm text-zinc-300 sm:grid-cols-3">
                    <span>Price: ${product.price}</span>
                    <span>Inventory: {product.inventoryQuantity}</span>
                    <span>Shipping: ${product.shippingPrice}</span>
                  </div>
                </div>
              ))}
            </div>
          </MarketplaceCard>

          <MarketplaceCard title="Seller profile" description="Store details and status summary.">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img src={sellerProfileData.logoUrl} alt={sellerProfileData.storeName} className="h-16 w-16 rounded-full object-cover" />
                <div>
                  <p className="text-lg font-semibold text-white">{sellerProfileData.storeName}</p>
                  <p className="text-sm text-zinc-300">{sellerProfileData.contactEmail}</p>
                </div>
              </div>
              <p className="text-sm text-zinc-300">{sellerProfileData.bio}</p>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-3 text-sm text-zinc-200">
                Approval: <span className="font-semibold text-white">{sellerProfileData.status}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/seller/profile" className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white">View profile</Link>
                <Link href="/seller/products/new" className="rounded-full bg-amber-300 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-black">Add product</Link>
              </div>
            </div>
          </MarketplaceCard>
        </div>
      </div>
    </main>
  );
}
