"use client";

import Link from "next/link";

const cases = [
  { id: "cs-2001", title: "Customer tracking concern", status: "open", date: "2026-08-12" },
  { id: "cs-2002", title: "Authenticity question", status: "seller_response_requested", date: "2026-08-10" },
];

export default function SellerCasesPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs uppercase tracking-[0.36em] text-amber-200/80">Seller cases</p>
          <h1 className="mt-2 text-3xl font-semibold">Customer support queue</h1>
        </div>

        <div className="mt-6 space-y-3">
          {cases.map((item) => (
            <Link key={item.id} href={`/seller/cases/${item.id}`} className="block rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.24em] text-zinc-500">{item.id} • {item.date}</p>
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
