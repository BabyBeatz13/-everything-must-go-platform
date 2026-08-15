"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AccountLayout } from "../../../components/account/AccountLayout";
import { SectionCard } from "../../../components/account/SectionCard";
import { getRecentlyViewedItems, type RecentlyViewedItem } from "@/lib/customer-experience";

export default function RecentlyViewedPage() {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const recent = await getRecentlyViewedItems();
      setItems(recent);
      setLoading(false);
    })();
  }, []);

  return (
    <AccountLayout
      title="Recently Viewed Products"
      description="Your recent marketplace browsing history is kept in the customer account layer for faster resumption and personalization."
    >
      <SectionCard
        title="Recent browsing"
        description="Your latest product views are saved locally and synced to your authenticated account when available."
      >
        {loading ? (
          <p className="text-sm uppercase tracking-[0.3em] text-amber-100">Loading history...</p>
        ) : items.length === 0 ? (
          <div className="rounded-[24px] border border-white/10 bg-black/30 p-4 text-sm text-zinc-300">
            You have not viewed any products yet. Explore the marketplace to build your recent history.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((item) => (
              <div key={item.id} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
                <div className="flex items-start gap-3">
                  <img src={item.imageUrl} alt={item.title} className="h-20 w-20 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-amber-200/80">{item.category ?? "Marketplace"}</p>
                    <Link href={`/product/${item.productId}`} className="mt-1 block text-base font-semibold text-white hover:text-amber-100">
                      {item.title}
                    </Link>
                    <p className="mt-2 text-amber-300">${item.price.toFixed(2)}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.22em] text-zinc-400">{new Date(item.viewedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </AccountLayout>
  );
}
