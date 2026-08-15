"use client";

import { useEffect } from "react";
import { recordRecentlyViewedProduct } from "@/lib/customer-experience";
import type { MarketplaceProductCardView } from "@/lib/marketplace";

export function RecentlyViewedTracker({ product }: { product: MarketplaceProductCardView }) {
  useEffect(() => {
    void recordRecentlyViewedProduct({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      storeName: product.storeName,
    });
  }, [product]);

  return null;
}
