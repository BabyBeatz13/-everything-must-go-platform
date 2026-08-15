import Link from "next/link";
import { staffMembers } from "@/lib/support";

export default async function AdminStaffDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = staffMembers.find((person) => person.id === id);

  if (!member) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] p-8 text-white">
        <div className="mx-auto max-w-3xl rounded-[30px] border border-white/10 bg-white/[0.04] p-6">Staff member not found.</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/admin/staff" className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200">Back to staff</Link>

        <div className="mt-6 rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">{member.role}</p>
          <h1 className="mt-2 text-3xl font-semibold">{member.name}</h1>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-[10px] uppercase tracking-[0.26em] text-zinc-400">Status</p><p className="mt-2 text-sm text-white">{member.status}</p></div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-[10px] uppercase tracking-[0.26em] text-zinc-400">Assigned tickets</p><p className="mt-2 text-sm text-white">{member.assignedTickets}</p></div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-[10px] uppercase tracking-[0.26em] text-zinc-400">Skills</p><p className="mt-2 text-sm text-white">{member.skills.join(", ")}</p></div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-[10px] uppercase tracking-[0.26em] text-zinc-400">Permissions</p><p className="mt-2 text-sm text-white">{member.role}</p></div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-full bg-amber-300 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-black">Suspend</button>
            <button className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">Change role</button>
          </div>
        </div>
      </div>
    </main>
  );
}
