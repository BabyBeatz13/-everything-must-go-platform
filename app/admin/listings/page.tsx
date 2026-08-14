"use client";

import { MarketplaceCard } from "@/components/marketplace/MarketplaceCard";
import { SellerShell } from "@/components/seller/SellerShell";

const listingRows = [
  {
    id: "lst-102",
    title: "18K Gold Cuban Link Chain",
    seller: "Golden Crest Studio",
    status: "pending_verification",
    authenticity: "High-value review required",
    risk: "authenticity review required",
  },
  {
    id: "lst-103",
    title: "Hermes Mini Kelly Replica",
    seller: "Northline Vault",
    status: "rejected",
    authenticity: "Counterfeit concern",
    risk: "prohibited replica",
  },
  {
    id: "lst-104",
    title: "Vintage Rolex Submariner",
    seller: "Harbor & Co.",
    status: "verified",
    authenticity: "Verification approved",
    risk: "none",
  },
];

const statuses: Record<string, string> = {
  pending_verification: "Pending verification",
  verified: "Verified",
  rejected: "Rejected",
  needs_more_information: "Needs more info",
  not_required: "Not required",
};

export default function AdminListingsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[30px] border border-amber-300/20 bg-white/[0.03] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Admin panel</p>
          <h1 className="mt-2 text-3xl font-semibold">Listing authenticity review</h1>
        </div>

        <div className="grid gap-6">
          {listingRows.map((listing) => (
            <MarketplaceCard key={listing.id} title={listing.title} description={`${listing.seller} • ${listing.authenticity}`}>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Status: {statuses[listing.status] ?? listing.status}</p>
                  <p className="mt-2 text-sm text-zinc-300">Risk flag: {listing.risk}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">Approve</button>
                  <button type="button" className="rounded-full border border-amber-400/40 bg-amber-500/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200">More docs</button>
                  <button type="button" className="rounded-full border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-200">Reject</button>
                  <button type="button" className="rounded-full border border-white/10 bg-black/25 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-200">Suspend</button>
                </div>
              </div>
            </MarketplaceCard>
          ))}
        </div>
      </div>
    </main>
  );
}
