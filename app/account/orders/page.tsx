"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAuthenticatedSupabaseUser } from "@/lib/client-auth";
import { supabase } from "@/lib/supabase";

type OrderRow = {
  id: string;
  order_number: string;
  created_at: string;
  grand_total_cents: number;
  payment_status: string;
  fulfillment_status: string;
};

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const user = await getAuthenticatedSupabaseUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("orders")
        .select("id, order_number, created_at, grand_total_cents, payment_status, fulfillment_status")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      setOrders((data as OrderRow[]) ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs uppercase tracking-[0.36em] text-amber-200/80">Your orders</p>
          <h1 className="mt-2 text-3xl font-semibold">Order history</h1>
        </div>

        <div className="mt-6 space-y-3">
          {loading ? <p className="text-sm uppercase tracking-[0.3em] text-amber-100">Loading orders...</p> : null}
          {!loading && orders.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-zinc-300">No orders yet.</p>
          ) : null}
          {orders.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.id}`} className="block rounded-2xl border border-white/10 bg-black/30 p-4">
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
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
