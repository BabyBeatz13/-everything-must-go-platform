import Link from "next/link";

const sellers = [
  { name: "Velvet & Vine Studio", status: "pending_review", agreements: "2 of 3 accepted" },
  { name: "North & Pine", status: "active", agreements: "3 of 3 accepted" },
  { name: "Golden Crest Studio", status: "requires_update", agreements: "1 of 3 accepted" },
  { name: "Haven & Home", status: "review_hold", agreements: "2 of 3 accepted" },
];

export default function AdminComplianceSellersPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Seller compliance</h1>
          </div>
          <Link href="/admin/compliance" className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-amber-300/40 hover:text-amber-100">
            Back to compliance
          </Link>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-3 text-sm text-amber-100">
            DRAFT — Requires business/legal review before production launch.
          </div>

          <div className="space-y-3">
            {sellers.map((seller) => (
              <div key={seller.name} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{seller.name}</p>
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">{seller.status}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-zinc-300">{seller.agreements}</span>
                  <button className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-200">
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
