"use client";

import { useState } from "react";
import { addMarketplaceProductToCart } from "@/lib/cart";
import type { MarketplaceProductCardView } from "@/lib/marketplace";

type MarketplaceProductActionsProps = {
  product: MarketplaceProductCardView;
};

export function MarketplaceProductActions({ product }: MarketplaceProductActionsProps) {
  const [message, setMessage] = useState("");
  const [loadingAction, setLoadingAction] = useState<"cart" | "checkout" | "">("");

  const disabled = !product.inStock || product.status !== "active";

  async function addToCart() {
    setLoadingAction("cart");
    const result = await addMarketplaceProductToCart(product, 1);
    if (!result.ok) {
      setMessage(result.error ?? "Unable to add this product to your cart.");
    } else {
      setMessage("Added to cart.");
    }
    setLoadingAction("");
  }

  async function buyNow() {
    setLoadingAction("checkout");
    const result = await addMarketplaceProductToCart(product, 1);
    if (!result.ok) {
      setMessage(result.error ?? "Unable to continue to checkout.");
      setLoadingAction("");
      return;
    }

    window.location.href = "/checkout";
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={addToCart}
          disabled={disabled || loadingAction !== ""}
          className="flex-1 rounded-full bg-amber-300 px-5 py-3 text-sm font-bold uppercase tracking-[0.25em] text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === "cart" ? "Adding..." : "Add to Cart"}
        </button>
        <button
          type="button"
          onClick={buyNow}
          disabled={disabled || loadingAction !== ""}
          className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold uppercase tracking-[0.25em] text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === "checkout" ? "Redirecting..." : "Buy Now"}
        </button>
      </div>
      {disabled ? (
        <p className="mt-3 text-sm text-rose-200">This product is unavailable for checkout right now.</p>
      ) : null}
      {message ? <p className="mt-3 text-sm text-amber-100">{message}</p> : null}
    </div>
  );
}
