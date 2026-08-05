type AccountMetricProps = {
  label: string;
  value: string;
};

export function AccountMetric({ label, value }: AccountMetricProps) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-black/30 p-4">
      <p className="text-[10px] uppercase tracking-[0.35em] text-amber-200/80">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
