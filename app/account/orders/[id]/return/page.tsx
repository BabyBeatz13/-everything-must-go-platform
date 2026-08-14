"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const returnReasons = [
  "Item not received",
  "Item damaged",
  "Wrong item",
  "Item not as described",
  "Suspected counterfeit",
  "Authenticity concern",
  "Changed mind",
  "Other",
] as const;

export default function AccountReturnRequestPage() {
  const params = useParams<{ id: string }>();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Request a return</p>
          <h1 className="mt-2 text-3xl font-semibold">Order {params.id}</h1>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-zinc-200">
              Return reason
              <select className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none">
                {returnReasons.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </label>
            <label className="text-sm text-zinc-200">
              Preferred resolution
              <select className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none">
                <option value="refund">Refund</option>
                <option value="replacement">Replacement</option>
                <option value="store_credit">Store credit</option>
              </select>
            </label>
          </div>

          <div className="mt-4">
            <label className="block text-sm text-zinc-200">
              Explanation
              <textarea className="mt-2 min-h-28 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" placeholder="Share order details, damage, or authenticity concerns." />
            </label>
          </div>

          <div className="mt-4">
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Evidence upload</p>
            <div className="mt-2 rounded-2xl border border-dashed border-amber-300/40 bg-black/30 p-4 text-sm text-zinc-300">
              Photos and documents can be attached during review. Private evidence remains restricted to the buyer, seller, and authorized admins.
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" className="rounded-full bg-amber-300 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.2em] text-black">Submit return request</button>
            <Link href="/account/orders" className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white">Cancel</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
