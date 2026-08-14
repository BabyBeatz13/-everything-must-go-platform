"use client";

const riskSignals = [
  { name: "High refund rate seller", level: "high" },
  { name: "Repeated authenticity complaints", level: "critical" },
  { name: "Late shipment pattern", level: "medium" },
  { name: "Multiple flagged listings", level: "high" },
  { name: "Suspicious account activity", level: "low" },
];

export default function AdminRiskPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-amber-300/20 bg-white/[0.03] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Admin risk center</p>
          <h1 className="mt-2 text-3xl font-semibold">Internal risk signals</h1>
        </div>

        <div className="mt-6 space-y-3">
          {riskSignals.map((signal) => (
            <div key={signal.name} className="flex items-center justify-between rounded-[24px] border border-white/10 bg-black/30 p-4">
              <p className="font-medium text-zinc-200">{signal.name}</p>
              <span className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${signal.level === "critical" ? "border-rose-500/30 bg-rose-500/10 text-rose-200" : signal.level === "high" ? "border-amber-500/30 bg-amber-500/10 text-amber-200" : signal.level === "medium" ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-200" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"}`}>
                {signal.level}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
