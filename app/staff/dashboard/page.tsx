import { getSupportMetrics, staffMembers } from "@/lib/support";

export default function StaffDashboardPage() {
  const metrics = getSupportMetrics();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-amber-300/20 bg-white/[0.04] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Staff dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold">Assigned queue overview</h1>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Assigned tickets", String(metrics.total)],
            ["Unassigned", String(metrics.newTickets)],
            ["Urgent", String(metrics.urgent)],
            ["Escalated", String(metrics.escalated)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[24px] border border-white/10 bg-black/35 p-4">
              <p className="text-[10px] uppercase tracking-[0.26em] text-zinc-400">{label}</p>
              <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-[10px] uppercase tracking-[0.4em] text-amber-200/80">Assigned queue</p>
            <div className="mt-4 space-y-3">
              {staffMembers.map((member) => (
                <div key={member.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">{member.name}</p>
                    <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-100">{member.role}</span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-300">Skills: {member.skills.join(", ")}</p>
                  <p className="mt-1 text-sm text-zinc-400">Assigned tickets: {member.assignedTickets}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-[10px] uppercase tracking-[0.4em] text-amber-200/80">Actions</p>
            <div className="mt-4 space-y-3 text-sm text-zinc-200">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-3">Assign ticket</div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-3">Escalate case</div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-3">Resolve issue</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
