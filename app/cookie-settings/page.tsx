import Link from "next/link";

export default function CookieSettingsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Everything Must Go</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Cookie Settings</h1>
          </div>
          <Link href="/" className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-amber-300/40 hover:text-amber-100">
            Back to home
          </Link>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-3 text-sm text-amber-100">
            DRAFT — Requires business/legal review before production launch.
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              { category: "Necessary", description: "Required for security, account access, and marketplace functionality." },
              { category: "Preferences", description: "Used to remember language, display, and saved user preference choices." },
              { category: "Analytics", description: "Measures traffic and feature usage to improve the marketplace experience." },
              { category: "Marketing", description: "Used for campaign measurement and personalized experiences where consent is collected." },
            ].map((item) => (
              <div key={item.category} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <h2 className="text-lg font-semibold text-white">{item.category}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-300">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-full bg-amber-300 px-4 py-2 text-sm font-bold uppercase tracking-[0.24em] text-black">Accept all</button>
            <button className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold uppercase tracking-[0.24em] text-white">Save preferences</button>
          </div>
        </div>
      </div>
    </main>
  );
}
