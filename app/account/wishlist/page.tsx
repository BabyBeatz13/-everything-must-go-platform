"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AccountLayout } from "../../../components/account/AccountLayout";
import { SectionCard } from "../../../components/account/SectionCard";
import { getWishlistItems, toggleWishlistItem, type CustomerWishlistItem } from "@/lib/customer-experience";

export default function WishlistPage() {
  const [items, setItems] = useState<CustomerWishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const wishlist = await getWishlistItems();
      setItems(wishlist);
      setLoading(false);
    })();
  }, []);

  async function removeItem(item: CustomerWishlistItem) {
    const isSaved = await toggleWishlistItem({
      id: item.productId,
      title: item.title,
      price: item.price,
      image: item.imageUrl,
      category: item.category ?? "General",
      storeName: item.storeName ?? "Seller store",
    });

    if (!isSaved) {
      setItems((current) => current.filter((entry) => entry.productId !== item.productId));
    }
  }

  return (
    <AccountLayout
      title="Wishlist"
      description="Keep premium items saved for later so your marketplace experience stays personalized and efficient."
    >
      <SectionCard
        title="Saved favorites"
        description="Your wishlist stays synced across the marketplace experience and will continue expanding with shareable seller lists."
      >
        {loading ? (
          <p className="text-sm uppercase tracking-[0.3em] text-amber-100">Loading wishlist...</p>
        ) : items.length === 0 ? (
          <div className="rounded-[24px] border border-white/10 bg-black/30 p-4 text-sm text-zinc-300">
            No saved items yet. Start by adding favorites from the marketplace.
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
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href={`/product/${item.productId}`} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white">
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => void removeItem(item)}
                    className="rounded-full border border-rose-300/35 bg-rose-300/10 px-3 py-1.5 text-xs font-semibold text-rose-100"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </AccountLayout>
  );
}
