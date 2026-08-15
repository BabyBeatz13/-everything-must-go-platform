"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getAuthenticatedSupabaseUser } from "@/lib/client-auth";
import { supabase } from "@/lib/supabase";
import { getShippingTimeline } from "@/lib/shipping";

type OrderItemRow = {
  id: string;
  product_title_snapshot: string;
  quantity: number;
  seller_earnings_cents: number;
  shipping_amount_cents: number;
  fulfillment_status: string;
  tracking_number: string | null;
  carrier: string | null;
};

type OrderRow = {
  id: string;
  order_number: string;
  created_at: string;
  payment_status: string;
  fulfillment_status: string;
  grand_total_cents: number;
  shipment_status: string | null;
  tracking_number: string | null;
  carrier: string | null;
  estimated_delivery_end: string | null;
  payout_hold_status: string | null;
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
        .select("id, order_number, created_at, payment_status, fulfillment_status, grand_total_cents, shipment_status, tracking_number, carrier, estimated_delivery_end, payout_hold_status")
        .eq("id", id)
        .eq("customer_id", user.id)
        .maybeSingle();

      setOrder((orderData as OrderRow | null) ?? null);

      const { data: itemData } = await supabase
        .from("order_items")
        .select("id, product_title_snapshot, quantity, seller_earnings_cents, shipping_amount_cents, fulfillment_status, tracking_number, carrier")
        .eq("order_id", id);

      setItems((itemData as OrderItemRow[]) ?? []);
      setLoading(false);
    })();
  }, [params.id]);

  const shipmentStatus = order?.shipment_status ?? "pending";
  const timeline = getShippingTimeline(shipmentStatus, order?.tracking_number ?? null, order?.estimated_delivery_end ?? null);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/account/orders" className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200">Back to orders</Link>

        {loading ? <p className="mt-4 text-sm uppercase tracking-[0.3em] text-amber-100">Loading order...</p> : null}

        {order ? (
          <div className="mt-4 space-y-6">
            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-100">{order.order_number || order.id}</p>
              <p className="mt-2 text-sm text-zinc-300">{new Date(order.created_at).toLocaleString()}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.22em] text-zinc-300">{order.payment_status} • {order.fulfillment_status}</p>
              <p className="mt-2 text-2xl font-semibold text-amber-300">${(Number(order.grand_total_cents || 0) / 100).toFixed(2)}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-[10px] uppercase tracking-[0.26em] text-zinc-400">Tracking</p>
                  <p className="mt-2 text-sm font-semibold text-white">{order.tracking_number ?? "Pending"}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-[10px] uppercase tracking-[0.26em] text-zinc-400">Carrier</p>
                  <p className="mt-2 text-sm font-semibold text-white">{order.carrier ?? "Unavailable"}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-[10px] uppercase tracking-[0.26em] text-zinc-400">Estimated delivery</p>
                  <p className="mt-2 text-sm font-semibold text-white">{order.estimated_delivery_end ? new Date(order.estimated_delivery_end).toLocaleDateString() : "Pending"}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-[10px] uppercase tracking-[0.26em] text-zinc-400">Protection</p>
                  <p className="mt-2 text-sm font-semibold text-emerald-200">Eligible</p>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Shipping timeline</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                {timeline.map((step) => (
                  <div key={step.label} className={`rounded-2xl border p-3 ${step.active ? "border-amber-300/35 bg-amber-300/10" : "border-white/10 bg-black/25"}`}>
                    <p className="text-[10px] uppercase tracking-[0.26em] text-zinc-400">{step.label}</p>
                    <p className="mt-2 text-sm text-white">{step.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Package tracking</p>
                {order.tracking_number ? (
                  <a
                    href={order.carrier === "UPS" ? `https://www.ups.com/track?tracknum=${encodeURIComponent(order.tracking_number)}` : `https://www.google.com/search?q=${encodeURIComponent(`${order.carrier ?? "carrier"} ${order.tracking_number}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-amber-300/35 bg-amber-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-100"
                  >
                    Track Package
                  </a>
                ) : null}
              </div>

              <div className="mt-4 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <p className="font-semibold text-white">{item.product_title_snapshot}</p>
                    <p className="mt-1 text-sm text-zinc-300">Qty {item.quantity} • Status: {item.fulfillment_status}</p>
                    <p className="mt-1 text-sm text-zinc-400">Shipping: ${(Number(item.shipping_amount_cents || 0) / 100).toFixed(2)}</p>
                    <p className="mt-1 text-sm text-zinc-400">Tracking: {item.tracking_number ?? "Not assigned"}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : !loading ? (
          <p className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-zinc-300">Order not found.</p>
        ) : null}
      </div>
    </main>
  );
}
