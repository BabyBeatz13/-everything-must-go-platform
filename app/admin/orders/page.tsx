"use client";

import { useEffect, useMemo, useState } from "react";
import { getCurrentUserRole } from "@/lib/client-auth";
import { supabase } from "@/lib/supabase";

type AdminOrder = {
  id: string;
  order_number: string;
  created_at: string;
  grand_total_cents: number;
  payment_status: string;
  fulfillment_status: string;
};

export default function AdminOrdersPage() {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  useEffect(() => {
    void (async () => {
      const role = await getCurrentUserRole();
      if (role !== "admin") {
        setAllowed(false);
        setLoading(false);
        return;
      }

      setAllowed(true);
      const { data } = await supabase
        .from("orders")
        .select("id, order_number, created_at, grand_total_cents, payment_status, fulfillment_status")
        .order("created_at", { ascending: false })
        .limit(100);

      setOrders((data as AdminOrder[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const totals = useMemo(() => {
    const gmv = orders.reduce((sum, order) => sum + Number(order.grand_total_cents || 0), 0);
    const paid = orders.filter((order) => order.payment_status === "paid").length;
    const failed = orders.filter((order) => order.payment_status === "failed").length;
    return { gmv, paid, failed };
  }, [orders]);

  if (loading) {
    return <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] p-8 text-sm uppercase tracking-[0.3em] text-amber-100">Loading admin orders...</main>;
  }

  if (!allowed) {
    return <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] p-8 text-sm uppercase tracking-[0.3em] text-rose-200">Unauthorized: admin access required.</main>;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs uppercase tracking-[0.36em] text-amber-200/80">Admin orders</p>
          <h1 className="mt-2 text-3xl font-semibold">Marketplace order monitoring</h1>
          <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-amber-100/80">Stripe test mode</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-xs text-zinc-400">Gross merchandise value</p><p className="mt-1 text-2xl font-semibold text-white">${(totals.gmv / 100).toFixed(2)}</p></div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-xs text-zinc-400">Paid orders</p><p className="mt-1 text-2xl font-semibold text-white">{totals.paid}</p></div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4"><p className="text-xs text-zinc-400">Failed payments</p><p className="mt-1 text-2xl font-semibold text-white">{totals.failed}</p></div>
        </div>

        <div className="mt-6 space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{order.order_number || order.id}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.24em] text-zinc-500">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-300">${(Number(order.grand_total_cents || 0) / 100).toFixed(2)}</p>
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">{order.payment_status} • {order.fulfillment_status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
