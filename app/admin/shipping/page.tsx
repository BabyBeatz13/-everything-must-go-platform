import { AdminShell } from "@/components/admin/AdminShell";

const shipments = [
  {
    id: "shp-1041",
    seller: "Velvet & Vine",
    customer: "Avery Brooks",
    carrier: "UPS",
    tracking: "1Z8734A",
    status: "in_transit",
    due: "On time",
    guarantee: "Eligible",
  },
  {
    id: "shp-1042",
    seller: "Collector Vault",
    customer: "J. Rivera",
    carrier: "FedEx",
    tracking: "78421491575",
    status: "delayed",
    due: "Late by 2 days",
    guarantee: "Review",
  },
];

export default function AdminShippingPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <AdminShell />

        <div className="flex-1 space-y-5">
          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Admin shipping center</p>
            <h1 className="mt-2 text-3xl font-semibold">Fulfillment oversight</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[26px] border border-white/10 bg-black/30 p-5">
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400">Marketplace on-time</p>
              <p className="mt-2 text-2xl font-semibold text-white">96.4%</p>
            </div>
            <div className="rounded-[26px] border border-white/10 bg-black/30 p-5">
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400">Delayed shipments</p>
              <p className="mt-2 text-2xl font-semibold text-white">2.1%</p>
            </div>
            <div className="rounded-[26px] border border-white/10 bg-black/30 p-5">
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400">High-risk sellers</p>
              <p className="mt-2 text-2xl font-semibold text-white">3</p>
            </div>
          </div>

          <section className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Shipments</p>
            <div className="mt-4 space-y-3">
              {shipments.map((shipment) => (
                <div key={shipment.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{shipment.seller}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.24em] text-zinc-500">{shipment.customer} • {shipment.carrier}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-amber-300">{shipment.status}</p>
                      <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">{shipment.tracking}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.22em] text-zinc-300">
                    <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1">{shipment.due}</span>
                    <span className="rounded-full border border-amber-300/35 bg-amber-300/10 px-2 py-1 text-amber-100">{shipment.guarantee}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
