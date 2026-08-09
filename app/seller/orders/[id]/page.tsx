"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SellerShell } from "@/components/seller/SellerShell";
import { getCurrentSellerProfile } from "@/lib/client-auth";
import { supabase } from "@/lib/supabase";

type SellerOrderItem = {
  id: string;
  product_title_snapshot: string;
  quantity: number;
  seller_earnings_cents: number;
  shipping_amount_cents: number;
  fulfillment_status: string;
  refund_status: string;
  tracking_number: string | null;
};

export default function SellerOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [items, setItems] = useState<SellerOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sellerId, setSellerId] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const id = params.id;
      if (!id) {
        setLoading(false);
        return;
      }
      const seller = await getCurrentSellerProfile();
      if (!seller?.id) {
        setLoading(false);
        return;
      }
      setSellerId(String(seller.id));

      const { data } = await supabase
        .from("order_items")
        .select("id, product_title_snapshot, quantity, seller_earnings_cents, shipping_amount_cents, fulfillment_status, refund_status, tracking_number")
        .eq("order_id", id)
        .eq("seller_id", String(seller.id));

      setItems((data as SellerOrderItem[]) ?? []);
      setLoading(false);
    })();
  }, [params.id]);

  async function updateItem(id: string, fields: Partial<SellerOrderItem>) {
    if (!sellerId || !params.id) return;

    await supabase
      .from("order_items")
      .update({
        fulfillment_status: fields.fulfillment_status,
        tracking_number: fields.tracking_number,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("order_id", params.id)
      .eq("seller_id", sellerId);

    setItems((current) => current.map((row) => (row.id === id ? { ...row, ...fields } : row)));
  }

  return (
    <SellerShell title="Order detail" subtitle="Item-level fulfillment controls and payout impact per order.">
      <div>
        <Link href="/seller/orders" className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200">Back to seller orders</Link>
      </div>
      <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-100">Seller order detail</p>
        {loading ? <p className="mt-4 text-sm uppercase tracking-[0.3em] text-amber-100">Loading order items...</p> : null}
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="font-semibold text-white">{item.product_title_snapshot}</p>
              <p className="mt-1 text-sm text-zinc-300">Qty {item.quantity}</p>
              <p className="mt-1 text-sm text-zinc-400">Net earnings: ${(Number(item.seller_earnings_cents || 0) / 100).toFixed(2)}</p>
              <p className="mt-1 text-sm text-zinc-400">Refund: {item.refund_status}</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <label className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                  Fulfillment status
                  <select
                    value={item.fulfillment_status}
                    onChange={(event) => void updateItem(item.id, { fulfillment_status: event.target.value })}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-white outline-none"
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
                <label className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                  Tracking number
                  <input
                    defaultValue={item.tracking_number ?? ""}
                    onBlur={(event) => void updateItem(item.id, { tracking_number: event.target.value || null })}
                    placeholder="Carrier tracking code"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-white outline-none"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SellerShell>
  );
}
