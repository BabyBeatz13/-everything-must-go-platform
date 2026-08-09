import type { ReactNode } from "react";

type MarketplaceCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function MarketplaceCard({ title, description, children }: MarketplaceCardProps) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_16px_50px_rgba(0,0,0,0.34)]">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {description ? <p className="mt-1 text-sm text-zinc-300">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
