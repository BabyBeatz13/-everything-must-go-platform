import { MarketplaceCard } from "@/components/marketplace/MarketplaceCard";
import { StatusBadge } from "@/components/marketplace/StatusBadge";
import { sellerProfileData } from "@/lib/marketplace-data";

export default function SellerProfilePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[30px] border border-amber-300/20 bg-white/[0.03] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Seller profile</p>
          <h1 className="mt-2 text-3xl font-semibold">{sellerProfileData.storeName}</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <MarketplaceCard title="Store identity">
            <div className="flex items-center gap-4">
              <img src={sellerProfileData.logoUrl} alt={sellerProfileData.storeName} className="h-20 w-20 rounded-full object-cover" />
              <div>
                <p className="text-xl font-semibold text-white">{sellerProfileData.storeName}</p>
                <p className="text-sm text-zinc-300">{sellerProfileData.contactEmail}</p>
              </div>
            </div>
            <div className="mt-5">
              <StatusBadge status={sellerProfileData.status} />
            </div>
          </MarketplaceCard>

          <MarketplaceCard title="About" description="Seller bio and store details for marketplace shoppers.">
            <p className="text-sm leading-7 text-zinc-200">{sellerProfileData.bio}</p>
            <div className="mt-5 grid gap-3 rounded-[22px] border border-white/10 bg-black/25 p-4 text-sm text-zinc-200 sm:grid-cols-2">
              <div><span className="text-zinc-400">Store name:</span> {sellerProfileData.storeName}</div>
              <div><span className="text-zinc-400">Status:</span> {sellerProfileData.status}</div>
              <div><span className="text-zinc-400">Created:</span> {sellerProfileData.createdAt}</div>
              <div><span className="text-zinc-400">Updated:</span> {sellerProfileData.updatedAt}</div>
            </div>
          </MarketplaceCard>
        </div>
      </div>
    </main>
  );
}
