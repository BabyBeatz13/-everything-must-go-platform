import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminShipmentsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <AdminShell />
        <div className="flex-1 rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Admin shipment records</p>
          <h1 className="mt-2 text-3xl font-semibold">Shipment operations</h1>
          <p className="mt-3 text-sm text-zinc-300">This foundation supports carrier, tracking, shipment exceptions, payout holds, and delivery protection review.</p>
        </div>
      </div>
    </main>
  );
}
