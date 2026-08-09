"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
};

export default function SellerOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [items, setItems] = useState<SellerOrderItem[]>([]);
  const [loading, setLoading] = useState(true);

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

      const { data } = await supabase
        .from("order_items")
        .select("id, product_title_snapshot, quantity, seller_earnings_cents, shipping_amount_cents, fulfillment_status, refund_status")
        .eq("order_id", id)
        .eq("seller_id", String(seller.id));

      setItems((data as SellerOrderItem[]) ?? []);
      setLoading(false);
    })();
  }, [params.id]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/seller/orders" className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-zinc-200">Back to seller orders</Link>
        <div className="mt-4 rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-100">Seller order detail</p>
          {loading ? <p className="mt-4 text-sm uppercase tracking-[0.3em] text-amber-100">Loading order items...</p> : null}
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="font-semibold text-white">{item.product_title_snapshot}</p>
                <p className="mt-1 text-sm text-zinc-300">Qty {item.quantity} • Status: {item.fulfillment_status}</p>
                <p className="mt-1 text-sm text-zinc-400">Net earnings: ${(Number(item.seller_earnings_cents || 0) / 100).toFixed(2)}</p>
                <p className="mt-1 text-sm text-zinc-400">Refund: {item.refund_status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
