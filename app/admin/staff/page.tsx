import Link from "next/link";
import { staffMembers } from "@/lib/support";

export default function AdminStaffPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Staff management</p>
          <h1 className="mt-2 text-3xl font-semibold">Marketplace staff roster</h1>
        </div>

        <div className="mt-6 space-y-3">
          {staffMembers.map((member) => (
            <Link key={member.id} href={`/admin/staff/${member.id}`} className="block rounded-[28px] border border-white/10 bg-black/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{member.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-zinc-500">{member.role}</p>
                </div>
                <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-100">{member.status}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
