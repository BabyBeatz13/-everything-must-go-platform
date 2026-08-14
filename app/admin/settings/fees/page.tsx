"use client";

export default function AdminSettingsFeesPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-amber-300/20 bg-white/[0.03] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Admin settings</p>
          <h1 className="mt-2 text-3xl font-semibold">Marketplace fee settings</h1>
        </div>

        <div className="mt-6 rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Default marketplace fee</p>
              <p className="mt-2 text-3xl font-semibold text-amber-300">8%</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Minimum platform fee</p>
              <p className="mt-2 text-3xl font-semibold text-amber-300">$0.00</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-200">
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Configurable fee architecture</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Default marketplace fee</li>
              <li>Category-specific fee override</li>
              <li>Seller-specific promotional fee</li>
              <li>Premium seller fee</li>
              <li>Minimum platform fee</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
