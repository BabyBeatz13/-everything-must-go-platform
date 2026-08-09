import type { ReactNode } from "react";

type StatusBadgeProps = {
  status: string;
  children?: ReactNode;
};

const tones: Record<string, string> = {
  Approved: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  Pending: "border-amber-400/40 bg-amber-500/10 text-amber-200",
  Rejected: "border-rose-400/40 bg-rose-500/10 text-rose-200",
  Suspended: "border-red-400/40 bg-red-500/10 text-red-200",
  active: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  draft: "border-zinc-400/40 bg-zinc-500/10 text-zinc-200",
  paused: "border-amber-400/40 bg-amber-500/10 text-amber-200",
  archived: "border-slate-400/40 bg-slate-500/10 text-slate-200",
  Processing: "border-amber-400/40 bg-amber-500/10 text-amber-200",
  Shipped: "border-sky-400/40 bg-sky-500/10 text-sky-200",
  Delivered: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  Cancelled: "border-rose-400/40 bg-rose-500/10 text-rose-200",
};

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const tone = tones[status] ?? "border-white/10 bg-white/5 text-zinc-200";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] ${tone}`}>
      {children ?? status}
    </span>
  );
}
