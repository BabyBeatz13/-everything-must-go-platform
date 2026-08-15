import Link from "next/link";
import { getSupportTicketById, supportMessages } from "@/lib/support";

export default async function SupportTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = getSupportTicketById(id);

  if (!ticket) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] p-8 text-white">
        <div className="mx-auto max-w-3xl rounded-[30px] border border-white/10 bg-white/[0.04] p-6">Ticket not found.</div>
      </main>
    );
  }

  const messages = supportMessages.filter((message) => message.ticketId === ticket.id);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/support/tickets" className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200">Back to tickets</Link>
          <button className="rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-100">Close ticket</button>
        </div>

        <div className="mt-6 rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">{ticket.ticketNumber}</p>
              <h1 className="mt-2 text-3xl font-semibold">{ticket.subject}</h1>
            </div>
            <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-100">{ticket.status}</span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-[10px] uppercase tracking-[0.26em] text-zinc-400">Category</p><p className="mt-2 text-sm text-white">{ticket.category}</p></div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-[10px] uppercase tracking-[0.26em] text-zinc-400">Priority</p><p className="mt-2 text-sm text-white">{ticket.priority}</p></div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-[10px] uppercase tracking-[0.26em] text-zinc-400">Order</p><p className="mt-2 text-sm text-white">{ticket.orderId ?? "Not linked"}</p></div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-[10px] uppercase tracking-[0.26em] text-zinc-400">Updated</p><p className="mt-2 text-sm text-white">{new Date(ticket.updatedAt).toLocaleDateString()}</p></div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-200">
            {ticket.description}
          </div>

          <div className="mt-6 space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`rounded-2xl border p-4 ${message.senderType === "internal_note" ? "border-rose-500/30 bg-rose-500/10" : "border-white/10 bg-black/30"}`}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">{message.senderName}</p>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{message.senderType}</span>
                </div>
                <p className="mt-2 text-sm text-zinc-200">{message.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
            <label className="block text-xs uppercase tracking-[0.24em] text-zinc-400">
              Reply
              <textarea className="mt-2 min-h-24 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none" placeholder="Write a message to the customer or seller" />
            </label>
            <div className="mt-3 flex justify-end">
              <button className="rounded-full bg-amber-300 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-black">Send response</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
