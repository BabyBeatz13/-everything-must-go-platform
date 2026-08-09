"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { calculateCartTotals, getCartItems, groupCartItemsBySeller, type CartItem } from "@/lib/cart";
import { addSavedAddress, getSavedAddresses, type ShippingAddress, type ShippingAddressInput } from "@/lib/addresses";
import { getSupabaseAccessToken } from "@/lib/client-auth";

type ContactInfo = {
  email: string;
  phone: string;
};

function getSession() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("emg-account-session");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as { email: string; authenticated: boolean };
  } catch {
    return null;
  }
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [contact, setContact] = useState<ContactInfo>({ email: "", phone: "" });
  const [newAddress, setNewAddress] = useState<ShippingAddressInput>({
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    phone: "",
    isDefault: false,
  });

  useEffect(() => {
    const session = getSession();
    if (!session?.authenticated) {
      window.location.href = "/login?redirect=/checkout";
      return;
    }

    setContact((prev) => ({ ...prev, email: session.email || "" }));

    void (async () => {
      try {
        const [cartItems, savedAddresses] = await Promise.all([getCartItems(), getSavedAddresses()]);
        setItems(cartItems);
        setAddresses(savedAddresses);
        const defaultAddress = savedAddresses.find((address) => address.isDefault) ?? savedAddresses[0];
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        }
      } catch {
        setError("Unable to load checkout details.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totals = useMemo(() => calculateCartTotals(items), [items]);
  const groupedBySeller = useMemo(() => groupCartItemsBySeller(items), [items]);
  const hasUnavailable = items.some((item) => !item.inStock || item.status !== "active" || item.quantity > item.inventory);

  async function onSaveAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const created = await addSavedAddress(newAddress);
      const nextAddresses = [created, ...addresses.filter((address) => address.id !== created.id)];
      setAddresses(nextAddresses);
      setSelectedAddressId(created.id);
      setNewAddress({
        firstName: "",
        lastName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "US",
        phone: "",
        isDefault: false,
      });
      setError("");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save shipping address.");
    }
  }

  async function onContinueToSecurePayment() {
    if (hasUnavailable || !selectedAddressId || !contact.email || checkoutLoading) {
      return;
    }

    setCheckoutLoading(true);
    setError("");

    try {
      const token = await getSupabaseAccessToken();
      if (!token) {
        throw new Error("Please sign in again to continue checkout.");
      }

      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          addressId: selectedAddressId,
          contactEmail: contact.email,
          contactPhone: contact.phone,
        }),
      });

      const payload = (await response.json()) as { checkoutUrl?: string; error?: string };
      if (!response.ok || !payload.checkoutUrl) {
        throw new Error(payload.error || "Unable to start secure payment.");
      }

      window.location.href = payload.checkoutUrl;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Unable to start secure payment.");
      setCheckoutLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[30px] border border-white/10 bg-white/[0.04] p-8 text-center text-sm uppercase tracking-[0.35em] text-amber-100">
          Loading checkout...
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[30px] border border-white/10 bg-white/[0.04] p-8 text-center sm:p-10">
          <p className="text-xs uppercase tracking-[0.36em] text-amber-200/80">Checkout unavailable</p>
          <h1 className="mt-3 text-3xl font-semibold">Your cart is empty</h1>
          <p className="mt-4 text-zinc-300">Add marketplace products to your cart before checking out.</p>
          <Link href="/cart" className="mt-6 inline-flex rounded-full bg-amber-300 px-6 py-3 text-sm font-bold uppercase tracking-[0.26em] text-black">
            View cart
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
            <p className="text-xs uppercase tracking-[0.36em] text-amber-200/80">Checkout</p>
            <h1 className="mt-2 text-3xl font-semibold">Marketplace shipping and review</h1>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-white">Contact</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-zinc-300">
                Email
                <input
                  type="email"
                  value={contact.email}
                  onChange={(event) => setContact((prev) => ({ ...prev, email: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
                  required
                />
              </label>
              <label className="text-sm text-zinc-300">
                Phone (optional)
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(event) => setContact((prev) => ({ ...prev, phone: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
                />
              </label>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-white">Shipping Address</h2>

            {addresses.length > 0 ? (
              <div className="mt-4 space-y-3">
                {addresses.map((address) => (
                  <label key={address.id} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-black/25 p-3 text-sm text-zinc-200">
                    <input
                      type="radio"
                      name="selectedAddress"
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                      className="mt-1"
                    />
                    <span>
                      <span className="font-semibold text-white">{address.firstName} {address.lastName}</span>
                      <span className="block text-zinc-300">
                        {address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ""}, {address.city}, {address.state} {address.postalCode}, {address.country}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-zinc-300">No saved addresses yet. Add one below.</p>
            )}

            <form onSubmit={onSaveAddress} className="mt-6 grid gap-3 sm:grid-cols-2">
              <input placeholder="First name" value={newAddress.firstName} onChange={(event) => setNewAddress((prev) => ({ ...prev, firstName: event.target.value }))} className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none" required />
              <input placeholder="Last name" value={newAddress.lastName} onChange={(event) => setNewAddress((prev) => ({ ...prev, lastName: event.target.value }))} className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none" required />
              <input placeholder="Street address" value={newAddress.addressLine1} onChange={(event) => setNewAddress((prev) => ({ ...prev, addressLine1: event.target.value }))} className="sm:col-span-2 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none" required />
              <input placeholder="Apartment / unit (optional)" value={newAddress.addressLine2} onChange={(event) => setNewAddress((prev) => ({ ...prev, addressLine2: event.target.value }))} className="sm:col-span-2 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none" />
              <input placeholder="City" value={newAddress.city} onChange={(event) => setNewAddress((prev) => ({ ...prev, city: event.target.value }))} className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none" required />
              <input placeholder="State" value={newAddress.state} onChange={(event) => setNewAddress((prev) => ({ ...prev, state: event.target.value }))} className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none" required />
              <input placeholder="ZIP code" value={newAddress.postalCode} onChange={(event) => setNewAddress((prev) => ({ ...prev, postalCode: event.target.value }))} className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none" required />
              <input placeholder="Country" value={newAddress.country} onChange={(event) => setNewAddress((prev) => ({ ...prev, country: event.target.value }))} className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none" required />
              <label className="sm:col-span-2 flex items-center gap-2 text-sm text-zinc-300">
                <input type="checkbox" checked={newAddress.isDefault} onChange={(event) => setNewAddress((prev) => ({ ...prev, isDefault: event.target.checked }))} />
                Set as default shipping address
              </label>
              <button type="submit" className="sm:col-span-2 rounded-full bg-amber-300 px-5 py-3 text-sm font-bold uppercase tracking-[0.24em] text-black">
                Save shipping address
              </button>
            </form>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-white">Shipping</h2>
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-zinc-200">
              <p className="font-semibold text-white">Standard shipping</p>
              <p className="mt-1 text-zinc-300">Seller-specific shipping costs are calculated per item. Free shipping applies where available.</p>
            </div>
          </div>

          {error ? <p className="rounded-xl border border-rose-300/35 bg-rose-300/10 px-3 py-2 text-sm text-rose-100">{error}</p> : null}
        </section>

        <aside className="h-fit rounded-[28px] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.36em] text-amber-200/80">Order Summary</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Seller-grouped items</h2>

          <div className="mt-5 space-y-4">
            {Object.entries(groupedBySeller).map(([sellerName, sellerItems]) => (
              <div key={sellerName} className="rounded-2xl border border-white/10 bg-black/25 p-3">
                <p className="text-xs uppercase tracking-[0.24em] text-amber-100">Seller: {sellerName}</p>
                <div className="mt-3 space-y-3">
                  {sellerItems.map((item) => (
                    <div key={item.marketplaceProductId} className="flex items-center gap-3">
                      <img src={item.image} alt={item.title} className="h-14 w-14 rounded-xl border border-white/10 object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">{item.title}</p>
                        <p className="text-xs text-zinc-400">Qty {item.quantity}</p>
                      </div>
                      <p className="text-sm text-zinc-200">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 text-sm text-zinc-300">
            <div className="flex items-center justify-between"><span>Merchandise subtotal</span><span>${totals.merchandiseSubtotal.toFixed(2)}</span></div>
            <div className="flex items-center justify-between"><span>Shipping total</span><span>${totals.shippingSubtotal.toFixed(2)}</span></div>
            <div className="flex items-center justify-between"><span>Tax (placeholder)</span><span>${totals.estimatedTax.toFixed(2)}</span></div>
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-lg font-semibold text-white">
              <span>Grand total</span>
              <span className="text-amber-300">${totals.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void onContinueToSecurePayment()}
            disabled={hasUnavailable || !selectedAddressId || !contact.email || checkoutLoading}
            className={`mt-6 inline-flex w-full justify-center rounded-full px-5 py-3 text-sm font-bold uppercase tracking-[0.24em] ${hasUnavailable || !selectedAddressId || !contact.email || checkoutLoading ? "cursor-not-allowed border border-white/10 bg-white/[0.04] text-zinc-400" : "bg-amber-300 text-black"}`}
          >
            {checkoutLoading ? "Redirecting to Stripe..." : "Continue to Secure Payment"}
          </button>
          <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-amber-100/80">Stripe test mode</p>

          {hasUnavailable ? <p className="mt-3 text-sm text-rose-100">Resolve unavailable items before proceeding.</p> : null}
        </aside>
      </div>
    </main>
  );
}
