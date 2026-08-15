import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <AdminShell />
        <div className="flex-1 rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Shipment detail</p>
          <h1 className="mt-2 text-3xl font-semibold">Order shipment review #{(params as any).id ?? "unknown"}</h1>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Carrier</p>
              <p className="mt-2 text-lg font-semibold text-white">UPS</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Tracking</p>
              <p className="mt-2 text-lg font-semibold text-white">1Z8734A</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Status</p>
              <p className="mt-2 text-lg font-semibold text-amber-100">In transit</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Delivery protection</p>
              <p className="mt-2 text-lg font-semibold text-emerald-200">Eligible</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
