import Link from "next/link";
import { getLegalPolicySlugs } from "@/lib/legal";

export default function LegalHomePage() {
  const policySlugs = getLegalPolicySlugs();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Everything Must Go</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Legal & Policy Center</h1>
          </div>
          <Link href="/" className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-amber-300/40 hover:text-amber-100">
            Back to home
          </Link>
        </div>

        <div className="mb-8 rounded-[28px] border border-amber-300/20 bg-black/30 p-6">
          <p className="text-sm leading-7 text-zinc-300">
            DRAFT — Requires business/legal review before production launch.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {policySlugs.map((slug) => (
            <Link key={slug} href={`/legal/${slug}`} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-0.5 hover:border-amber-300/40 hover:bg-white/[0.05]">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-200/80">Policy</p>
              <h2 className="mt-3 text-xl font-semibold text-white">{slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-300">Draft marketplace legal language for internal review and operational readiness.</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
