"use client";

const reports = [
  { name: "Gross sales report", period: "This month" },
  { name: "Seller performance report", period: "Rolling 90 days" },
  { name: "Refund and dispute summary", period: "This quarter" },
  { name: "Authenticity review metrics", period: "Current cycle" },
];

export default function AdminReportsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-amber-300/20 bg-white/[0.03] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Admin reports</p>
          <h1 className="mt-2 text-3xl font-semibold">Marketplace reporting</h1>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {reports.map((report) => (
            <div key={report.name} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
              <p className="font-semibold text-white">{report.name}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-500">{report.period}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
