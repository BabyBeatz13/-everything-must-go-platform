"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getCurrentUserRole } from "@/lib/client-auth";

type ReturnRow = {
  id: string;
  order_id: string | null;
  status: string | null;
  reason: string | null;
  refund_amount_cents: number | null;
};

export default function AdminReturnsPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [returns, setReturns] = useState<ReturnRow[]>([]);

  useEffect(() => {
    void (async () => {
      const role = await getCurrentUserRole();
      if (role !== "admin") {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      setAuthorized(true);
      const { data } = await supabase.from("return_requests").select("id, order_id, status, reason, refund_amount_cents").order("requested_at", { ascending: false }).limit(100);
      setReturns((data as ReturnRow[]) ?? []);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] p-8 text-sm uppercase tracking-[0.3em] text-amber-100">Loading returns...</main>;
  }

  if (!authorized) {
    return <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] p-8 text-sm uppercase tracking-[0.3em] text-rose-200">Unauthorized: admin access required.</main>;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Admin returns</p>
          <h1 className="mt-2 text-3xl font-semibold">Return and refund review center</h1>
        </div>

        <div className="mt-6 space-y-3">
          {returns.map((entry) => (
            <div key={entry.id} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-white">Order: {entry.order_id}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">Reason: {entry.reason || "review required"}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-300">${((Number(entry.refund_amount_cents ?? 0)) / 100).toFixed(2)}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-400">{entry.status || "requested"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
