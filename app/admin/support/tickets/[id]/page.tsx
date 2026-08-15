import Link from "next/link";
import { getSupportTicketById } from "@/lib/support";

export default async function AdminSupportTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = getSupportTicketById(id);

  if (!ticket) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] p-8 text-white">
        <div className="mx-auto max-w-3xl rounded-[30px] border border-white/10 bg-white/[0.04] p-6">Ticket not found.</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/admin/support/tickets" className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200">Back to queue</Link>

        <div className="mt-6 rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">{ticket.ticketNumber}</p>
          <h1 className="mt-2 text-3xl font-semibold">{ticket.subject}</h1>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-[10px] uppercase tracking-[0.26em] text-zinc-400">Status</p><p className="mt-2 text-sm text-white">{ticket.status}</p></div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-[10px] uppercase tracking-[0.26em] text-zinc-400">Priority</p><p className="mt-2 text-sm text-white">{ticket.priority}</p></div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-[10px] uppercase tracking-[0.26em] text-zinc-400">Category</p><p className="mt-2 text-sm text-white">{ticket.category}</p></div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-[10px] uppercase tracking-[0.26em] text-zinc-400">Assigned</p><p className="mt-2 text-sm text-white">{ticket.assignedStaffUser ?? "Unassigned"}</p></div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-200">{ticket.description}</div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-full bg-amber-300 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-black">Assign</button>
            <button className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">Escalate</button>
            <button className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">Resolve</button>
          </div>
        </div>
      </div>
    </main>
  );
}
