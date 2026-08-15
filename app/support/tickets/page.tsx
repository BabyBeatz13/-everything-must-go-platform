import Link from "next/link";
import { supportTickets } from "@/lib/support";

export default function SupportTicketsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Your support</p>
            <h1 className="mt-2 text-3xl font-semibold">Ticket history</h1>
          </div>
          <Link href="/support/new" className="rounded-full bg-amber-300 px-5 py-3 text-xs font-bold uppercase tracking-[0.22em] text-black">New ticket</Link>
        </div>

        <div className="mt-6 space-y-3">
          {supportTickets.map((ticket) => (
            <Link key={ticket.id} href={`/support/tickets/${ticket.ticketNumber}`} className="block rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-zinc-500">{ticket.ticketNumber}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{ticket.subject}</p>
                </div>
                <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-100">{ticket.status}</span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
                <span>{ticket.category}</span>
                <span>•</span>
                <span>{ticket.priority}</span>
                <span>•</span>
                <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
