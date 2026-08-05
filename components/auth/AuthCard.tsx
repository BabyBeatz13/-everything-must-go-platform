import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerLinkHref: string;
  footerLinkText: string;
  footerHint: string;
};

export function AuthCard({
  title,
  subtitle,
  children,
  footerLinkHref,
  footerLinkText,
  footerHint,
}: AuthCardProps) {
  return (
    <section className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-12 text-white">
      <div className="grid w-full gap-6 rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_70px_rgba(0,0,0,0.46)] lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
        <div className="rounded-[24px] border border-amber-300/25 bg-[linear-gradient(160deg,rgba(244,198,97,0.18),rgba(21,21,21,0.9))] p-6">
          <div className="inline-flex rounded-full border border-amber-300/35 bg-black/35 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.36em] text-amber-100">
            Everything Must Go
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-md text-base text-zinc-300">{subtitle}</p>
          <div className="mt-8 space-y-4 text-sm text-zinc-200">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">Marketplace-ready customer auth with an upgrade path into future seller accounts.</div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">Protected account workspace for wishlist, addresses, saved cart, and recent views.</div>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-black/30 p-5 sm:p-7">
          {children}
          <div className="mt-5 text-sm text-zinc-400">
            {footerHint} {" "}
            <a href={footerLinkHref} className="font-semibold text-amber-100 transition hover:text-amber-300">
              {footerLinkText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
