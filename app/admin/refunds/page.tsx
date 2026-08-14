"use client";

const refunds = [
  { id: "rf-1", order: "EMG-1001", customer: "A. Moore", amount: "$180.00", status: "pending" },
  { id: "rf-2", order: "EMG-1005", customer: "J. Park", amount: "$420.00", status: "approved" },
  { id: "rf-3", order: "EMG-1010", customer: "R. Silva", amount: "$96.00", status: "denied" },
];

export default function AdminRefundsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[30px] border border-amber-300/20 bg-white/[0.03] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Admin finance</p>
          <h1 className="mt-2 text-3xl font-semibold">Refund review</h1>
        </div>

        <div className="space-y-3">
          {refunds.map((refund) => (
            <div key={refund.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-white">{refund.order}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.24em] text-zinc-500">{refund.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-300">{refund.amount}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-400">{refund.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
