import Link from "next/link";
import { getSupportMetrics, supportCategories, supportTickets } from "@/lib/support";

export default function SupportPage() {
  const metrics = getSupportMetrics();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-amber-300/20 bg-white/[0.04] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Customer support</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Support center</h1>
            </div>
            <Link href="/support/new" className="rounded-full bg-amber-300 px-5 py-3 text-xs font-bold uppercase tracking-[0.24em] text-black">Open ticket</Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["New tickets", String(metrics.newTickets)],
              ["Urgent", String(metrics.urgent)],
              ["Open", String(metrics.total)],
              ["Average reply", metrics.avgResponseTime],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-[10px] uppercase tracking-[0.26em] text-zinc-400">{label}</p>
                <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-[10px] uppercase tracking-[0.4em] text-amber-200/80">Ticket categories</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {supportCategories.map((category) => (
                <div key={category} className="rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-zinc-200">
                  {category}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-[10px] uppercase tracking-[0.4em] text-amber-200/80">Quick links</p>
            <div className="mt-4 space-y-3">
              <Link href="/support/tickets" className="block rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white">View ticket history</Link>
              <Link href="/messages" className="block rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white">Messages</Link>
              <Link href="/help" className="block rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white">Help center</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] uppercase tracking-[0.4em] text-amber-200/80">Recent tickets</p>
            <Link href="/support/tickets" className="text-sm font-medium text-amber-100">View all</Link>
          </div>
          <div className="mt-4 space-y-3">
            {supportTickets.slice(0, 3).map((ticket) => (
              <Link key={ticket.id} href={`/support/tickets/${ticket.ticketNumber}`} className="block rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{ticket.subject}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-zinc-500">{ticket.ticketNumber} • {ticket.category}</p>
                  </div>
                  <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-100">{ticket.status}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
