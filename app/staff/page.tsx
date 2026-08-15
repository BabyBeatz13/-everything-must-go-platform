import Link from "next/link";

export default function StaffPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Staff center</p>
          <h1 className="mt-2 text-3xl font-semibold">Support and operations staff</h1>
          <div className="mt-6 space-y-3">
            <Link href="/staff/dashboard" className="block rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white">Dashboard</Link>
            <Link href="/staff/tickets" className="block rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white">Assigned tickets</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
