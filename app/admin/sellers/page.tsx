import { MarketplaceCard } from "../../../components/marketplace/MarketplaceCard";
import { StatusBadge } from "../../../components/marketplace/StatusBadge";
import { sellerApprovals } from "../../../lib/marketplace-data";

export default function AdminSellerApprovalsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[30px] border border-amber-300/20 bg-white/[0.03] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Admin panel</p>
          <h1 className="mt-2 text-3xl font-semibold">Seller approvals</h1>
        </div>

        <div className="grid gap-6">
          {sellerApprovals.map((seller) => (
            <MarketplaceCard key={seller.id} title={seller.storeName} description={seller.notes}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-zinc-300">Seller ID: {seller.sellerId}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.28em] text-zinc-500">Submitted: {seller.submittedAt}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={seller.status} />
                  <button type="button" className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                    Approve
                  </button>
                  <button type="button" className="rounded-full border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-200">
                    Reject
                  </button>
                  <button type="button" className="rounded-full border border-amber-400/40 bg-amber-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
                    Suspend
                  </button>
                </div>
              </div>
            </MarketplaceCard>
          ))}
        </div>
      </div>
    </main>
  );
}
