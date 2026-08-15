import Link from "next/link";

const complianceCards = [
  { href: "/admin/compliance/policies", title: "Policies", description: "Draft and published legal policies" },
  { href: "/admin/compliance/reports", title: "Reports", description: "IP and counterfeit queues" },
  { href: "/admin/compliance/violations", title: "Violations", description: "Moderation and enforcement actions" },
  { href: "/admin/compliance/sellers", title: "Seller compliance", description: "Acceptance and reacceptance tracking" },
];

export default function AdminComplianceHomePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Compliance Center</h1>
          </div>
          <Link href="/admin" className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-amber-300/40 hover:text-amber-100">
            Back to admin
          </Link>
        </div>

        <div className="mb-8 rounded-[28px] border border-amber-300/20 bg-black/30 p-5 text-sm text-zinc-300">
          DRAFT — Requires business/legal review before production launch.
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {complianceCards.map((card) => (
            <Link key={card.href} href={card.href} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-0.5 hover:border-amber-300/40 hover:bg-white/[0.05]">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-200/80">Queue</p>
              <h2 className="mt-3 text-xl font-semibold text-white">{card.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-300">{card.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
