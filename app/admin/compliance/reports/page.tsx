import Link from "next/link";

const reports = [
  { name: "IP reports", count: 2 },
  { name: "Counterfeit reports", count: 1 },
  { name: "Authenticity escalations", count: 5 },
  { name: "Open compliance reviews", count: 8 },
];

export default function AdminComplianceReportsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Compliance reports</h1>
          </div>
          <Link href="/admin/compliance" className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-amber-300/40 hover:text-amber-100">
            Back to compliance
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {reports.map((report) => (
            <div key={report.name} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-200/80">Queue</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">{report.count}</h2>
              <p className="mt-2 text-sm text-zinc-300">{report.name}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
