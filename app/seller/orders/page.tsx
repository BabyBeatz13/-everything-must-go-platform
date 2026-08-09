"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SellerShell } from "@/components/seller/SellerShell";
import { getCurrentSellerProfile } from "@/lib/client-auth";
import { getSellerOrdersPortal } from "@/lib/seller-portal";
import { supabase } from "@/lib/supabase";

type SellerOrderRow = {
  orderId: string;
  orderNumber: string;
  createdAt: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  sellerTotalCents: number;
  items: number;
  refunds: number;
};

const statusTabs = ["all", "pending_payment", "processing", "shipped", "delivered", "cancelled", "refunded"] as const;

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<SellerOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<(typeof statusTabs)[number]>("all");
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  async function loadOrders(status: string) {
    const rows = (await getSellerOrdersPortal(status)) as SellerOrderRow[];
    setOrders(rows);
    setLoading(false);
  }

  useEffect(() => {
    void (async () => {
      const seller = await getCurrentSellerProfile();
      if (!seller?.id) {
        setLoading(false);
        return;
      }
      setSellerId(String(seller.id));
      await loadOrders(activeStatus);
    })();
  }, [activeStatus]);

  async function updateFulfillment(orderId: string, fulfillmentStatus: string) {
    if (!sellerId) return;
    setUpdatingOrderId(orderId);

    await supabase
      .from("order_items")
      .update({ fulfillment_status: fulfillmentStatus, updated_at: new Date().toISOString() })
      .eq("order_id", orderId)
      .eq("seller_id", sellerId);

    setUpdatingOrderId(null);
    await loadOrders(activeStatus);
  }

  return (
    <SellerShell title="Order management" subtitle="Track paid, shipped, delivered, refunded, and cancelled states across seller-linked orders.">
      <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
        <p className="text-xs uppercase tracking-[0.36em] text-amber-200/80">Seller orders</p>
        <h2 className="mt-2 text-2xl font-semibold">Order items linked to your store</h2>
        <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-amber-100/80">Stripe test mode</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusTabs.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setActiveStatus(status)}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${activeStatus === status ? "border border-amber-300/45 bg-amber-300/15 text-amber-100" : "border border-white/10 bg-black/30 text-zinc-300"}`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? <p className="text-sm uppercase tracking-[0.3em] text-amber-100">Loading seller orders...</p> : null}
        {!loading && orders.length === 0 ? <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-zinc-300">No seller orders yet.</p> : null}
        {orders.map((order) => (
          <div key={order.orderId} className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link href={`/seller/orders/${order.orderId}`} className="block">
                <p className="font-semibold text-white">{order.orderNumber}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-zinc-500">{new Date(order.createdAt).toLocaleString()}</p>
              </Link>
              <div className="text-right">
                <p className="font-semibold text-amber-300">${(order.sellerTotalCents / 100).toFixed(2)}</p>
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">{order.paymentStatus} • {order.fulfillmentStatus}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-200">
                {order.items} items
              </span>
              <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-200">
                {order.refunds} refunds
              </span>
              <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-400">
                Update status
                <select
                  defaultValue={order.fulfillmentStatus}
                  disabled={updatingOrderId === order.orderId}
                  onChange={(event) => void updateFulfillment(order.orderId, event.target.value)}
                  className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs text-white outline-none"
                >
                  <option value="pending_payment">pending_payment</option>
                  <option value="processing">processing</option>
                  <option value="shipped">shipped</option>
                  <option value="delivered">delivered</option>
                  <option value="cancelled">cancelled</option>
                  <option value="refunded">refunded</option>
                  <option value="partially_refunded">partially_refunded</option>
                </select>
              </label>
            </div>
          </div>
        ))}
      </div>
    </SellerShell>
  );
}
