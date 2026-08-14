"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link href="/admin/orders" className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200">Back to orders</Link>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Order detail</p>
          <h1 className="mt-2 text-3xl font-semibold">Order {params.id}</h1>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Order state</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-200">
                <li>Payment: paid</li>
                <li>Fulfillment: shipped</li>
                <li>Shipment: in transit</li>
                <li>Refund state: none</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Actions</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className="rounded-full border border-amber-400/40 bg-amber-500/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200">Under review</button>
                <button type="button" className="rounded-full border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-200">Review shipment issue</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
