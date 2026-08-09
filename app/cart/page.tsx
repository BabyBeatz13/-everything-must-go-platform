"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  calculateCartTotals,
  getCartItems,
  groupCartItemsBySeller,
  removeCartItem,
  type CartItem,
  updateCartItemQuantity,
} from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const result = await getCartItems();
        setItems(result);
      } catch {
        setMessage("Unable to load your cart right now.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const groupedBySeller = useMemo(() => groupCartItemsBySeller(items), [items]);
  const totals = useMemo(() => calculateCartTotals(items), [items]);
  const hasUnavailable = items.some((item) => !item.inStock || item.status !== "active" || item.quantity > item.inventory);

  async function changeQuantity(item: CartItem, next: number) {
    const response = await updateCartItemQuantity(item.marketplaceProductId, next);
    if (!response.ok) {
      setMessage(response.error ?? "Unable to update quantity.");
      return;
    }

    const fresh = await getCartItems();
    setItems(fresh);
    setMessage("");
  }

  async function onRemove(item: CartItem) {
    const shouldRemove = window.confirm(`Remove ${item.title} from your cart?`);
    if (!shouldRemove) return;

    await removeCartItem(item.marketplaceProductId);
    const fresh = await getCartItems();
    setItems(fresh);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[30px] border border-white/10 bg-white/[0.04] p-8 text-center text-sm uppercase tracking-[0.35em] text-amber-100">
          Loading your cart...
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[30px] border border-white/10 bg-white/[0.04] p-8 text-center sm:p-10">
          <p className="text-xs uppercase tracking-[0.36em] text-amber-200/80">Your cart is empty</p>
          <h1 className="mt-3 text-3xl font-semibold">Add marketplace products to begin checkout</h1>
          <p className="mt-4 text-zinc-300">
            Affiliate product Buy Now actions remain external. Marketplace products added from product pages will appear here.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-amber-300 px-6 py-3 text-sm font-bold uppercase tracking-[0.26em] text-black"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-5">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.36em] text-amber-200/80">Shopping Cart</p>
            <h1 className="mt-2 text-3xl font-semibold">Marketplace checkout cart</h1>
            <p className="mt-2 text-sm text-zinc-300">Products are grouped by seller to support multi-seller order preparation.</p>
          </div>

          {Object.entries(groupedBySeller).map(([sellerName, sellerItems]) => (
            <div key={sellerName} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-amber-100">Seller: {sellerName}</h2>
                <span className="text-xs uppercase tracking-[0.28em] text-zinc-400">{sellerItems.length} items</span>
              </div>

              <div className="space-y-4">
                {sellerItems.map((item) => {
                  const lineSubtotal = item.unitPrice * item.quantity;
                  const shippingSubtotal = item.freeShipping ? 0 : item.shippingPrice * item.quantity;

                  return (
                    <article key={item.marketplaceProductId} className="rounded-2xl border border-white/10 bg-black/30 p-3 sm:p-4">
                      <div className="grid gap-4 md:grid-cols-[96px_1fr_auto] md:items-center">
                        <img src={item.image} alt={item.title} className="h-24 w-24 rounded-2xl border border-white/10 object-cover" />

                        <div>
                          <p className="text-base font-semibold text-white">{item.title}</p>
                          <p className="mt-1 text-sm text-zinc-300">{item.condition} • {item.category}</p>
                          <div className="mt-2 flex flex-wrap gap-2 text-xs uppercase tracking-[0.24em]">
                            <span className="rounded-full border border-white/10 bg-black/30 px-2 py-1 text-zinc-300">
                              {item.inStock ? `${item.inventory} in stock` : "Out of stock"}
                            </span>
                            {item.status !== "active" ? (
                              <span className="rounded-full border border-rose-300/40 bg-rose-300/10 px-2 py-1 text-rose-100">Inactive</span>
                            ) : null}
                            {item.freeShipping ? (
                              <span className="rounded-full border border-emerald-300/40 bg-emerald-300/10 px-2 py-1 text-emerald-100">Free shipping</span>
                            ) : null}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <p className="text-right text-lg font-semibold text-amber-300">${item.unitPrice.toFixed(2)}</p>

                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => void changeQuantity(item, item.quantity - 1)}
                              className="h-9 w-9 rounded-full border border-white/10 bg-white/[0.04] text-lg"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min={1}
                              max={item.inventory}
                              value={item.quantity}
                              onChange={(event) => {
                                const parsed = Number(event.target.value);
                                if (Number.isNaN(parsed)) return;
                                void changeQuantity(item, parsed);
                              }}
                              className="w-16 rounded-xl border border-white/10 bg-black/30 px-2 py-1 text-center text-sm text-white outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => void changeQuantity(item, item.quantity + 1)}
                              className="h-9 w-9 rounded-full border border-white/10 bg-white/[0.04] text-lg"
                              disabled={item.quantity >= item.inventory}
                            >
                              +
                            </button>
                          </div>

                          <p className="text-right text-xs text-zinc-400">Shipping: ${shippingSubtotal.toFixed(2)}</p>
                          <p className="text-right text-sm font-semibold text-white">Line subtotal: ${lineSubtotal.toFixed(2)}</p>
                          <button
                            type="button"
                            onClick={() => void onRemove(item)}
                            className="w-full rounded-full border border-rose-300/40 bg-rose-300/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-100"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        <aside className="h-fit rounded-[28px] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.36em] text-amber-200/80">Order Summary</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Checkout estimate</h2>

          <div className="mt-6 space-y-3 text-sm text-zinc-300">
            <div className="flex items-center justify-between"><span>Merchandise subtotal</span><span>${totals.merchandiseSubtotal.toFixed(2)}</span></div>
            <div className="flex items-center justify-between"><span>Estimated shipping</span><span>${totals.shippingSubtotal.toFixed(2)}</span></div>
            <div className="flex items-center justify-between"><span>Estimated tax</span><span>${totals.estimatedTax.toFixed(2)}</span></div>
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-lg font-semibold text-white">
              <span>Order total</span>
              <span className="text-amber-300">${totals.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {hasUnavailable ? (
            <p className="mt-4 rounded-xl border border-rose-300/35 bg-rose-300/10 px-3 py-2 text-sm text-rose-100">
              One or more items are unavailable or exceed inventory. Adjust your cart before checkout.
            </p>
          ) : null}

          {message ? <p className="mt-3 text-sm text-amber-100">{message}</p> : null}

          <Link
            href={hasUnavailable ? "/cart" : "/checkout"}
            className={`mt-6 inline-flex w-full justify-center rounded-full px-5 py-3 text-sm font-bold uppercase tracking-[0.24em] ${hasUnavailable ? "cursor-not-allowed border border-white/10 bg-white/[0.04] text-zinc-500" : "bg-amber-300 text-black"}`}
            aria-disabled={hasUnavailable}
            onClick={(event) => {
              if (hasUnavailable) {
                event.preventDefault();
              }
            }}
          >
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </main>
  );
}
