"use client";

import { useState } from "react";
import { SellerShell } from "@/components/seller/SellerShell";
import { defaultShippingMethods, type ShippingMethodDefinition } from "@/lib/shipping";

const methodTemplate = defaultShippingMethods[0];

export default function SellerShippingSettingsPage() {
  const [settings, setSettings] = useState({
    defaultHandlingTimeDays: 2,
    shippingOriginCountry: "US",
    shippingOriginState: "CA",
    processingDays: 2,
    weekendProcessingPreference: false,
    localPickupEnabled: false,
    freeShippingThreshold: 299,
  });

  const [methods, setMethods] = useState<ShippingMethodDefinition[]>(defaultShippingMethods);

  function updateMethod(id: string, field: keyof ShippingMethodDefinition, value: unknown) {
    setMethods((current) => current.map((method) => (method.id === id ? { ...method, [field]: value } : method)));
  }

  return (
    <SellerShell title="Shipping settings" subtitle="Configure fulfillment defaults, shipping methods, and premium item rules while keeping private origin data protected.">
      <section className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
        <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Seller shipping</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm text-zinc-300">
            Default handling time (days)
            <input
              type="number"
              min={1}
              value={settings.defaultHandlingTimeDays}
              onChange={(event) => setSettings((current) => ({ ...current, defaultHandlingTimeDays: Number(event.target.value || 1) }))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
            />
          </label>
          <label className="text-sm text-zinc-300">
            Shipping origin country
            <input
              value={settings.shippingOriginCountry}
              onChange={(event) => setSettings((current) => ({ ...current, shippingOriginCountry: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
            />
          </label>
          <label className="text-sm text-zinc-300">
            Shipping origin state/region
            <input
              value={settings.shippingOriginState}
              onChange={(event) => setSettings((current) => ({ ...current, shippingOriginState: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
            />
          </label>
          <label className="text-sm text-zinc-300">
            Processing days
            <input
              type="number"
              min={0}
              value={settings.processingDays}
              onChange={(event) => setSettings((current) => ({ ...current, processingDays: Number(event.target.value || 0) }))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-300 md:col-span-2">
            <input
              type="checkbox"
              checked={settings.weekendProcessingPreference}
              onChange={(event) => setSettings((current) => ({ ...current, weekendProcessingPreference: event.target.checked }))}
            />
            Weekend processing preference placeholder
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-300 md:col-span-2">
            <input
              type="checkbox"
              checked={settings.localPickupEnabled}
              onChange={(event) => setSettings((current) => ({ ...current, localPickupEnabled: event.target.checked }))}
            />
            Local pickup enabled
          </label>
          <label className="text-sm text-zinc-300 md:col-span-2">
            Free shipping threshold
            <input
              type="number"
              min={0}
              value={settings.freeShippingThreshold}
              onChange={(event) => setSettings((current) => ({ ...current, freeShippingThreshold: Number(event.target.value || 0) }))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
            />
          </label>
        </div>
      </section>

      <section className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6">
        <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Shipping methods</p>
        <div className="mt-5 space-y-3">
          {methods.map((method) => (
            <div key={method.id} className="rounded-2xl border border-white/10 bg-black/35 p-4">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                <label className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                  Name
                  <input
                    value={method.name}
                    onChange={(event) => updateMethod(method.id, "name", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-xs text-white outline-none"
                  />
                </label>
                <label className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                  Price
                  <input
                    type="number"
                    step="0.01"
                    value={method.price}
                    onChange={(event) => updateMethod(method.id, "price", Number(event.target.value || 0))}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-xs text-white outline-none"
                  />
                </label>
                <label className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                  Min days
                  <input
                    type="number"
                    value={method.estimatedMinDays}
                    onChange={(event) => updateMethod(method.id, "estimatedMinDays", Number(event.target.value || 0))}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-xs text-white outline-none"
                  />
                </label>
                <label className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                  Max days
                  <input
                    type="number"
                    value={method.estimatedMaxDays}
                    onChange={(event) => updateMethod(method.id, "estimatedMaxDays", Number(event.target.value || 0))}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-xs text-white outline-none"
                  />
                </label>
                <label className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-zinc-400">
                  Active
                  <input
                    type="checkbox"
                    checked={method.active}
                    onChange={(event) => updateMethod(method.id, "active", event.target.checked)}
                    className="mt-1"
                  />
                </label>
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-zinc-400">Description</p>
              <textarea
                value={method.description}
                onChange={(event) => updateMethod(method.id, "description", event.target.value)}
                className="mt-2 min-h-20 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-xs text-white outline-none"
              />
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-amber-300/25 bg-amber-300/10 p-4 text-sm text-amber-100">
          Buy Shipping Label — Coming Soon
        </div>
      </section>
    </SellerShell>
  );
}
