"use client";

import Link from "next/link";

const cases = [
  { id: "adm-case-1001", title: "Counterfeit handbag allegation", status: "under_review", customer: "A. Moore", seller: "Milan Atelier" },
  { id: "adm-case-1002", title: "Refund request review", status: "refund_pending", customer: "J. Park", seller: "Golden Crest Studio" },
  { id: "adm-case-1003", title: "Authenticity dispute", status: "resolved", customer: "R. Silva", seller: "Harbor & Co." },
];

export default function AdminCasesPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[30px] border border-amber-300/20 bg-white/[0.03] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Admin moderation</p>
          <h1 className="mt-2 text-3xl font-semibold">Marketplace cases</h1>
        </div>

        <div className="space-y-3">
          {cases.map((item) => (
            <Link key={item.id} href={`/admin/cases/${item.id}`} className="block rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.24em] text-zinc-500">{item.customer} • {item.seller}</p>
                </div>
                <span className="rounded-full border border-amber-300/35 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-100">
                  {item.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
