"use client";

const categories = [
  { name: "Jewelry", tier: "Luxury", authenticity: true, enabled: true },
  { name: "Handbags", tier: "Luxury", authenticity: true, enabled: true },
  { name: "Collectibles", tier: "High value", authenticity: true, enabled: true },
  { name: "Furniture", tier: "Standard", authenticity: false, enabled: true },
  { name: "Electronics", tier: "Standard", authenticity: false, enabled: true },
  { name: "Gardening", tier: "Standard", authenticity: false, enabled: true },
];

export default function AdminCategoriesPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-amber-300/20 bg-white/[0.03] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Admin categories</p>
          <h1 className="mt-2 text-3xl font-semibold">Category management</h1>
        </div>

        <div className="mt-6 grid gap-4">
          {categories.map((category) => (
            <div key={category.name} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-white">{category.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">{category.tier}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em]">
                  <span className={`rounded-full border px-2 py-1 ${category.enabled ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-rose-500/30 bg-rose-500/10 text-rose-200"}`}>
                    {category.enabled ? "Enabled" : "Disabled"}
                  </span>
                  <span className={`rounded-full border px-2 py-1 ${category.authenticity ? "border-amber-400/30 bg-amber-500/10 text-amber-200" : "border-white/10 bg-white/[0.03] text-zinc-300"}`}>
                    {category.authenticity ? "Authenticity required" : "Standard review"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
