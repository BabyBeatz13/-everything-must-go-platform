"use client";

import { MarketplaceCard } from "@/components/marketplace/MarketplaceCard";

const reviews = [
  {
    id: "auth-1",
    type: "Jewelry verification",
    seller: "Golden Crest Studio",
    item: "14K Diamond Tennis Necklace",
    status: "pending_verification",
    evidence: ["Purchase receipt", "Diamond grading report", "Hallmark photos"],
  },
  {
    id: "auth-2",
    type: "Designer handbag review",
    seller: "Milan Atelier",
    item: "Louis Vuitton Neverfull MM",
    status: "needs_more_information",
    evidence: ["Date code photo", "Serial photos", "Proof of purchase"],
  },
  {
    id: "auth-3",
    type: "Watch authentication",
    seller: "Harbor & Co.",
    item: "Rolex Submariner",
    status: "verified",
    evidence: ["Certificate", "Serial photos", "Packaging"] ,
  },
];

const statusMap: Record<string, string> = {
  pending_verification: "Pending verification",
  verified: "Verified",
  rejected: "Rejected",
  needs_more_information: "Needs more information",
  not_required: "Not required",
};

export default function AdminAuthenticityPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[30px] border border-amber-300/20 bg-white/[0.03] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Admin panel</p>
          <h1 className="mt-2 text-3xl font-semibold">Authenticity review queue</h1>
        </div>

        <div className="space-y-5">
          {reviews.map((review) => (
            <MarketplaceCard key={review.id} title={review.item} description={`${review.type} • ${review.seller}`}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Status: {statusMap[review.status] ?? review.status}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-300">
                    {review.evidence.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">Approve</button>
                  <button type="button" className="rounded-full border border-amber-400/40 bg-amber-500/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200">Request docs</button>
                  <button type="button" className="rounded-full border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-200">Reject</button>
                </div>
              </div>
            </MarketplaceCard>
          ))}
        </div>
      </div>
    </main>
  );
}
