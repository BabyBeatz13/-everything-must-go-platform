"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getAuthenticatedSupabaseUser } from "@/lib/client-auth";
import { supabase } from "@/lib/supabase";

type OrderItemRow = {
  id: string;
  product_title_snapshot: string;
  quantity: number;
  seller_earnings_cents: number;
  shipping_amount_cents: number;
  fulfillment_status: string;
};

type OrderRow = {
  id: string;
  order_number: string;
  created_at: string;
  payment_status: string;
  fulfillment_status: string;
  grand_total_cents: number;
};

export default function AccountOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [items, setItems] = useState<OrderItemRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const id = params.id;
      if (!id) {
        setLoading(false);
        return;
      }
      const user = await getAuthenticatedSupabaseUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: orderData } = await supabase
        .from("orders")
        .select("id, order_number, created_at, payment_status, fulfillment_status, grand_total_cents")
        .eq("id", id)
        .eq("customer_id", user.id)
        .maybeSingle();

      setOrder((orderData as OrderRow | null) ?? null);

      const { data: itemData } = await supabase
        .from("order_items")
        .select("id, product_title_snapshot, quantity, seller_earnings_cents, shipping_amount_cents, fulfillment_status")
        .eq("order_id", id);

      setItems((itemData as OrderItemRow[]) ?? []);
      setLoading(false);
    })();
  }, [params.id]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/account/orders" className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200">Back to orders</Link>

        {loading ? <p className="mt-4 text-sm uppercase tracking-[0.3em] text-amber-100">Loading order...</p> : null}

        {order ? (
          <div className="mt-4 rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-100">{order.order_number || order.id}</p>
            <p className="mt-2 text-sm text-zinc-300">{new Date(order.created_at).toLocaleString()}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.22em] text-zinc-300">{order.payment_status} • {order.fulfillment_status}</p>
            <p className="mt-2 text-2xl font-semibold text-amber-300">${(Number(order.grand_total_cents || 0) / 100).toFixed(2)}</p>

            <div className="mt-6 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="font-semibold text-white">{item.product_title_snapshot}</p>
                  <p className="mt-1 text-sm text-zinc-300">Qty {item.quantity} • Status: {item.fulfillment_status}</p>
                  <p className="mt-1 text-sm text-zinc-400">Shipping: ${(Number(item.shipping_amount_cents || 0) / 100).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        ) : !loading ? (
          <p className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-zinc-300">Order not found.</p>
        ) : null}
      </div>
    </main>
  );
}
