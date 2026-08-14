"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function AccountCaseDetailPage() {
  const params = useParams<{ id: string }>();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link href="/account/cases" className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200">Back to cases</Link>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs uppercase tracking-[0.36em] text-amber-200/80">Case {params.id}</p>
          <h1 className="mt-2 text-3xl font-semibold">Tracking delay and seller follow-up</h1>
          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-zinc-400">Status: open</p>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-200">
              Customer: “The tracking page has not updated since shipment, and the seller has not responded to my message.”
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-200">
              Seller response: “Carrier scan is pending. We are checking the shipment timeline and will update the case once the carrier confirms a scan.”
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm text-zinc-200">
              Add a response
              <textarea className="mt-2 min-h-24 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" placeholder="Write an update for the support team." />
            </label>
            <button type="button" className="mt-4 rounded-full bg-amber-300 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.2em] text-black">Send update</button>
          </div>
        </div>
      </div>
    </main>
  );
}
