import Link from "next/link";
import type { LegalPolicy } from "@/lib/legal";

export default function PolicyLayout({ policy }: { policy: LegalPolicy }) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Everything Must Go</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">{policy.title}</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/legal" className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-amber-300/40 hover:text-amber-100">
              Legal Center
            </Link>
            <Link href={policy.supportRoute} className="rounded-full bg-amber-300 px-4 py-2 text-sm font-bold uppercase tracking-[0.24em] text-black">
              Support
            </Link>
          </div>
        </div>

        <div className="mb-8 rounded-[28px] border border-amber-300/20 bg-black/30 p-5">
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.28em] text-zinc-300">
            <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-2.5 py-1 text-amber-100">{policy.status}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">Version {policy.version}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">Effective {policy.effectiveDate}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">Updated {policy.lastUpdated}</span>
          </div>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300">{policy.summary}</p>
          <div className="mt-4 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-3 text-sm text-amber-100">
            DRAFT — Requires business/legal review before production launch.
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 h-fit">
            <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-200/80">Table of contents</h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              {policy.toc.map((item) => (
                <li key={item} className="rounded-xl border border-white/8 bg-black/20 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </aside>

          <div className="space-y-8">
            {policy.sections.map((section) => (
              <section key={section.heading} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-xl font-semibold text-white">{section.heading}</h2>
                <div className="mt-4 space-y-4 text-base leading-7 text-zinc-300">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
