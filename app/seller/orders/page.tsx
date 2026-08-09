"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentSellerProfile } from "@/lib/client-auth";
import { supabase } from "@/lib/supabase";

type SellerOrderRow = {
  order_id: string;
  order_number: string;
  created_at: string;
  payment_status: string;
  fulfillment_status: string;
  seller_total_cents: number;
};

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<SellerOrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const seller = await getCurrentSellerProfile();
      if (!seller?.id) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("order_items")
        .select("order_id, seller_earnings_cents, orders!inner(order_number, created_at, payment_status, fulfillment_status)")
        .eq("seller_id", String(seller.id));

      const grouped = new Map<string, SellerOrderRow>();
      (data as Array<Record<string, unknown>> | null)?.forEach((row) => {
        const orderId = String(row.order_id);
        const order = row.orders as Record<string, unknown>;
        const existing = grouped.get(orderId) ?? {
          order_id: orderId,
          order_number: String(order.order_number ?? orderId),
          created_at: String(order.created_at ?? new Date().toISOString()),
          payment_status: String(order.payment_status ?? "pending_payment"),
          fulfillment_status: String(order.fulfillment_status ?? "pending_payment"),
          seller_total_cents: 0,
        };

        existing.seller_total_cents += Number(row.seller_earnings_cents ?? 0);
        grouped.set(orderId, existing);
      });

      setOrders(Array.from(grouped.values()).sort((a, b) => b.created_at.localeCompare(a.created_at)));
      setLoading(false);
    })();
  }, []);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs uppercase tracking-[0.36em] text-amber-200/80">Seller orders</p>
          <h1 className="mt-2 text-3xl font-semibold">Order items linked to your store</h1>
          <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-amber-100/80">Stripe test mode</p>
        </div>

        <div className="mt-6 space-y-3">
          {loading ? <p className="text-sm uppercase tracking-[0.3em] text-amber-100">Loading seller orders...</p> : null}
          {!loading && orders.length === 0 ? <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-zinc-300">No seller orders yet.</p> : null}
          {orders.map((order) => (
            <Link key={order.order_id} href={`/seller/orders/${order.order_id}`} className="block rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{order.order_number}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.24em] text-zinc-500">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-300">${(order.seller_total_cents / 100).toFixed(2)}</p>
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
