"use client";

const promos = [
  { name: "Luxury Seller Spotlight", status: "Active" },
  { name: "Midweek Gem Drop", status: "Draft" },
  { name: "Collector’s Vault", status: "Scheduled" },
];

export default function AdminPromotionsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-amber-300/20 bg-white/[0.03] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Admin promotions</p>
          <h1 className="mt-2 text-3xl font-semibold">Marketplace campaigns</h1>
        </div>

        <div className="mt-6 space-y-3">
          {promos.map((promo) => (
            <div key={promo.name} className="flex items-center justify-between rounded-[24px] border border-white/10 bg-black/30 p-4">
              <p className="font-semibold text-white">{promo.name}</p>
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-amber-200">{promo.status}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
