"use client";

import { useEffect, useState } from "react";
import { MarketplaceCard } from "@/components/marketplace/MarketplaceCard";
import { StatusBadge } from "@/components/marketplace/StatusBadge";
import { SellerShell } from "@/components/seller/SellerShell";
import { getSellerIdentity, updateSellerProfilePortal } from "@/lib/seller-portal";

type SellerProfileForm = {
  store_name: string;
  contact_email: string;
  bio: string;
  store_description: string;
  logo_url: string;
  banner_url: string;
  shipping_policy: string;
  return_policy: string;
  instagram: string;
  x: string;
  tiktok: string;
};

const initialForm: SellerProfileForm = {
  store_name: "",
  contact_email: "",
  bio: "",
  store_description: "",
  logo_url: "",
  banner_url: "",
  shipping_policy: "",
  return_policy: "",
  instagram: "",
  x: "",
  tiktok: "",
};

export default function SellerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("pending");
  const [form, setForm] = useState<SellerProfileForm>(initialForm);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const identity = await getSellerIdentity();
      const raw = identity?.seller as Record<string, unknown> | undefined;
      if (raw) {
        const social = (raw.social_links as Record<string, unknown> | null) ?? {};
        setForm({
          store_name: String(raw.store_name ?? ""),
          contact_email: String(raw.contact_email ?? ""),
          bio: String(raw.bio ?? ""),
          store_description: String(raw.store_description ?? ""),
          logo_url: String(raw.logo_url ?? ""),
          banner_url: String(raw.banner_url ?? ""),
          shipping_policy: String(raw.shipping_policy ?? ""),
          return_policy: String(raw.return_policy ?? ""),
          instagram: String(social.instagram ?? ""),
          x: String(social.x ?? ""),
          tiktok: String(social.tiktok ?? ""),
        });
        setStatus(String(raw.status ?? "pending"));
      }

      setLoading(false);
    })();
  }, []);

  async function saveProfile() {
    setSaving(true);
    setMessage(null);
    const result = await updateSellerProfilePortal({
      store_name: form.store_name,
      contact_email: form.contact_email,
      bio: form.bio,
      store_description: form.store_description,
      logo_url: form.logo_url,
      banner_url: form.banner_url,
      shipping_policy: form.shipping_policy,
      return_policy: form.return_policy,
      social_links: {
        instagram: form.instagram,
        x: form.x,
        tiktok: form.tiktok,
      },
    });

    setSaving(false);
    setMessage(result.ok ? "Store profile updated." : result.error ?? "Unable to update profile.");
  }

  return (
    <SellerShell title="Store profile" subtitle="Control storefront identity, policies, social links, and buyer-facing content.">
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <MarketplaceCard title="Store identity">
          {loading ? <p className="text-sm text-zinc-300">Loading profile...</p> : null}
          {!loading ? (
            <>
              <div className="flex items-center gap-4">
                <img src={form.logo_url || "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=500&q=80"} alt={form.store_name || "Store logo"} className="h-20 w-20 rounded-full object-cover" />
                <div>
                  <p className="text-xl font-semibold text-white">{form.store_name || "Seller store"}</p>
                  <p className="text-sm text-zinc-300">{form.contact_email || "No contact email"}</p>
                </div>
              </div>
              <div className="mt-5">
                <StatusBadge status={status} />
              </div>
            </>
          ) : null}
        </MarketplaceCard>

        <MarketplaceCard title="Edit storefront" description="Buyer-visible content for trust, conversion, and post-purchase support.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Store name" value={form.store_name} onChange={(value) => setForm({ ...form, store_name: value })} />
            <Input label="Contact email" value={form.contact_email} onChange={(value) => setForm({ ...form, contact_email: value })} />
            <Input label="Logo URL" value={form.logo_url} onChange={(value) => setForm({ ...form, logo_url: value })} />
            <Input label="Banner URL" value={form.banner_url} onChange={(value) => setForm({ ...form, banner_url: value })} />
            <Input label="Instagram" value={form.instagram} onChange={(value) => setForm({ ...form, instagram: value })} />
            <Input label="X / Twitter" value={form.x} onChange={(value) => setForm({ ...form, x: value })} />
            <Input label="TikTok" value={form.tiktok} onChange={(value) => setForm({ ...form, tiktok: value })} />
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs uppercase tracking-[0.24em] text-zinc-400">Bio</label>
              <textarea value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} className="min-h-24 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs uppercase tracking-[0.24em] text-zinc-400">Store description</label>
              <textarea value={form.store_description} onChange={(event) => setForm({ ...form, store_description: event.target.value })} className="min-h-24 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs uppercase tracking-[0.24em] text-zinc-400">Shipping policy</label>
              <textarea value={form.shipping_policy} onChange={(event) => setForm({ ...form, shipping_policy: event.target.value })} className="min-h-20 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs uppercase tracking-[0.24em] text-zinc-400">Return policy</label>
              <textarea value={form.return_policy} onChange={(event) => setForm({ ...form, return_policy: event.target.value })} className="min-h-20 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none" />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button type="button" onClick={() => void saveProfile()} disabled={saving || loading} className="rounded-full bg-amber-300 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.2em] text-black disabled:opacity-70">
                Save profile
              </button>
            </div>
          </div>
          {message ? <p className="mt-3 text-sm text-amber-100">{message}</p> : null}
        </MarketplaceCard>
      </div>
    </SellerShell>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (next: string) => void }) {
  return (
    <label>
      <span className="mb-1 block text-xs uppercase tracking-[0.24em] text-zinc-400">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none" />
    </label>
  );
}
