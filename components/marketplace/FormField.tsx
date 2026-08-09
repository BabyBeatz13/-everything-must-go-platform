import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  hint?: string;
  fullWidth?: boolean;
  children: ReactNode;
};

export function FormField({ label, hint, fullWidth = false, children }: FormFieldProps) {
  return (
    <label className={`block text-sm text-zinc-300 ${fullWidth ? "md:col-span-2" : ""}`}>
      <span className="mb-2 block font-medium text-zinc-200">{label}</span>
      {children}
      {hint ? <span className="mt-2 block text-xs text-zinc-400">{hint}</span> : null}
    </label>
  );
}
