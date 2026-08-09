"use client";

import { useEffect, useMemo, useState } from "react";
import { AccountLayout } from "../../../components/account/AccountLayout";
import { SectionCard } from "../../../components/account/SectionCard";
import {
  addSavedAddress,
  deleteSavedAddress,
  getSavedAddresses,
  setDefaultAddress,
  type ShippingAddress,
  type ShippingAddressInput,
  updateSavedAddress,
} from "@/lib/addresses";

const blankForm: ShippingAddressInput = {
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
};

export default function SavedAddressesPage() {
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [form, setForm] = useState<ShippingAddressInput>(blankForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void (async () => {
      const data = await getSavedAddresses();
      setAddresses(data);
      setLoading(false);
    })();
  }, []);

  const defaultAddress = useMemo(
    () => addresses.find((address) => address.isDefault),
    [addresses],
  );

  async function refresh() {
    const data = await getSavedAddresses();
    setAddresses(data);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      if (editingId) {
        await updateSavedAddress(editingId, form);
        setMessage("Address updated.");
      } else {
        await addSavedAddress(form);
        setMessage("Address saved.");
      }

      setForm(blankForm);
      setEditingId("");
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save this address.");
    }
  }

  async function onDelete(addressId: string) {
    const shouldDelete = window.confirm("Delete this address?");
    if (!shouldDelete) return;

    await deleteSavedAddress(addressId);
    await refresh();
  }

  async function onSetDefault(addressId: string) {
    await setDefaultAddress(addressId);
    await refresh();
  }

  function onEdit(address: ShippingAddress) {
    setEditingId(address.id);
    setForm({
      firstName: address.firstName,
      lastName: address.lastName,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault,
    });
  }

  return (
    <AccountLayout
      title="Saved Addresses"
      description="Manage shipping destinations used by marketplace checkout."
    >
      <SectionCard
        title="Address book"
        description="Add, edit, delete, and choose your default shipping address."
      >
        {loading ? (
          <p className="text-sm uppercase tracking-[0.3em] text-amber-100">Loading addresses...</p>
        ) : (
          <div className="space-y-3">
            {addresses.length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-300">No addresses saved yet.</p>
            ) : (
              addresses.map((address) => (
                <div key={address.id} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-white">
                      {address.firstName} {address.lastName}
                    </p>
                    {address.isDefault ? (
                      <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-amber-100">Default</span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-zinc-300">
                    {address.addressLine1}
                    {address.addressLine2 ? `, ${address.addressLine2}` : ""}, {address.city}, {address.state} {address.postalCode}, {address.country}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => onEdit(address)} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white">
                      Edit
                    </button>
                    <button type="button" onClick={() => void onDelete(address.id)} className="rounded-full border border-rose-300/35 bg-rose-300/10 px-3 py-1.5 text-xs font-semibold text-rose-100">
                      Delete
                    </button>
                    {!address.isDefault ? (
                      <button type="button" onClick={() => void onSetDefault(address.id)} className="rounded-full border border-amber-300/35 bg-amber-300/10 px-3 py-1.5 text-xs font-semibold text-amber-100">
                        Set default
                      </button>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 grid gap-3 sm:grid-cols-2">
          <input value={form.firstName} onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))} placeholder="First name" required className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none" />
          <input value={form.lastName} onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))} placeholder="Last name" required className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none" />
          <input value={form.addressLine1} onChange={(event) => setForm((prev) => ({ ...prev, addressLine1: event.target.value }))} placeholder="Street address" required className="sm:col-span-2 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none" />
          <input value={form.addressLine2} onChange={(event) => setForm((prev) => ({ ...prev, addressLine2: event.target.value }))} placeholder="Apartment / unit" className="sm:col-span-2 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none" />
          <input value={form.city} onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))} placeholder="City" required className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none" />
          <input value={form.state} onChange={(event) => setForm((prev) => ({ ...prev, state: event.target.value }))} placeholder="State" required className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none" />
          <input value={form.postalCode} onChange={(event) => setForm((prev) => ({ ...prev, postalCode: event.target.value }))} placeholder="ZIP code" required className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none" />
          <input value={form.country} onChange={(event) => setForm((prev) => ({ ...prev, country: event.target.value }))} placeholder="Country" required className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none" />
          <label className="sm:col-span-2 flex items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" checked={form.isDefault} onChange={(event) => setForm((prev) => ({ ...prev, isDefault: event.target.checked }))} />
            Set as default shipping address
          </label>
          <div className="sm:col-span-2 flex flex-wrap gap-2">
            <button type="submit" className="rounded-full bg-amber-300 px-5 py-3 text-sm font-bold uppercase tracking-[0.24em] text-black">
              {editingId ? "Update address" : "Save address"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingId("");
                  setForm(blankForm);
                }}
                className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold uppercase tracking-[0.24em] text-white"
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>

        {defaultAddress ? (
          <p className="mt-4 text-sm text-zinc-300">Default: {defaultAddress.firstName} {defaultAddress.lastName}</p>
        ) : null}
        {message ? <p className="mt-3 text-sm text-amber-100">{message}</p> : null}
      </SectionCard>
    </AccountLayout>
  );
}
