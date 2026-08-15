import Link from "next/link";
import { getSupportMetrics } from "@/lib/support";

export default function AdminSupportPage() {
  const metrics = getSupportMetrics();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-amber-300/20 bg-white/[0.04] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Support operations</p>
          <h1 className="mt-2 text-3xl font-semibold">Admin support dashboard</h1>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["New tickets", String(metrics.newTickets)],
            ["Open", String(metrics.total)],
            ["Urgent", String(metrics.urgent)],
            ["Escalated", String(metrics.escalated)],
            ["Waiting on customer", String(metrics.waitingCustomer)],
            ["Waiting on seller", String(metrics.waitingSeller)],
            ["Waiting on support", String(metrics.waitingSupport)],
            ["Average response", metrics.avgResponseTime],
            ["Average resolution", metrics.avgResolutionTime],
            ["Resolved today", String(metrics.resolvedToday)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[24px] border border-white/10 bg-black/35 p-4">
              <p className="text-[10px] uppercase tracking-[0.26em] text-zinc-400">{label}</p>
              <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] uppercase tracking-[0.38em] text-amber-200/80">Live queue</p>
              <Link href="/admin/support/tickets" className="text-sm text-amber-100">View tickets</Link>
            </div>
            <div className="mt-4 space-y-3">
              {[
                "EMG-1001 — Tracking not updating",
                "EMG-1002 — Refund delayed",
                "EMG-1003 — Authenticity review escalated",
              ].map((ticket) => (
                <div key={ticket} className="rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-zinc-200">{ticket}</div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-[10px] uppercase tracking-[0.38em] text-amber-200/80">Support routes</p>
            <div className="mt-4 space-y-3">
              <Link href="/admin/support/tickets" className="block rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white">Ticket queue</Link>
              <Link href="/admin/staff" className="block rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white">Staff management</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
