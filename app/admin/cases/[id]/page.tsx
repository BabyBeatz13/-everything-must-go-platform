"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function AdminCaseDetailPage() {
  const params = useParams<{ id: string }>();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link href="/admin/cases" className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200">Back to cases</Link>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs uppercase tracking-[0.36em] text-amber-200/80">Case {params.id}</p>
          <h1 className="mt-2 text-3xl font-semibold">Counterfeit handbag allegation</h1>
          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-zinc-400">Status: under_review</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Evidence</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-200">
                <li>Serial code photo</li>
                <li>Packaging photo</li>
                <li>Customer written explanation</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Actions</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">Approve</button>
                <button type="button" className="rounded-full border border-amber-400/40 bg-amber-500/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200">Request docs</button>
                <button type="button" className="rounded-full border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-200">Suspend listing</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
