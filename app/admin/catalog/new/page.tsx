"use client";

import { useMemo, useState } from "react";
import { catalogCategories, catalogSources, buildCatalogRecord, getCatalogRecords, saveCatalogRecords, type CatalogRecord } from "@/lib/catalog";

const emptyRecord = (): Partial<CatalogRecord> => ({
  id: `catalog-${Date.now()}`,
  source: "admin_curated",
  title: "",
  description: "",
  category: "Electronics",
  subcategory: "",
  brand: "",
  seller: "Admin catalog",
  image: "",
  images: [],
  price: 0,
  condition: "New",
  availability: "unknown",
  in_stock: true,
  active: true,
  featured: false,
  authenticity_status: "not_required",
  vintage: false,
  collectible: false,
  tags: [],
  search_keywords: [],
  listing_created_at: new Date().toISOString(),
  status: "active",
});

export default function AdminCatalogNewPage() {
  const [form, setForm] = useState<Partial<CatalogRecord>>(emptyRecord());
  const [notice, setNotice] = useState<string | null>(null);

  const canSubmit = useMemo(() => Boolean(form.title && form.category && form.price !== undefined), [form]);

  function updateField<K extends keyof CatalogRecord>(key: K, value: CatalogRecord[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newRecord = buildCatalogRecord(form as Partial<CatalogRecord>);
    const all = [...getCatalogRecords(), newRecord];
    saveCatalogRecords(all);
    setNotice(`Saved ${newRecord.title} to the admin catalog.`);
    setForm(emptyRecord());
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-amber-300/20 bg-white/[0.03] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Catalog</p>
          <h1 className="mt-2 text-3xl font-semibold">Create catalog record</h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 rounded-[28px] border border-white/10 bg-black/30 p-5">
          {notice && <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{notice}</div>}

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title"><input value={form.title ?? ""} onChange={(event) => updateField("title", event.target.value)} className="field" /></Field>
            <Field label="Brand"><input value={form.brand ?? ""} onChange={(event) => updateField("brand", event.target.value)} className="field" /></Field>
            <Field label="Category">
              <select value={form.category ?? "Electronics"} onChange={(event) => updateField("category", event.target.value)} className="field">
                {catalogCategories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </Field>
            <Field label="Subcategory"><input value={form.subcategory ?? ""} onChange={(event) => updateField("subcategory", event.target.value)} className="field" /></Field>
            <Field label="Source">
              <select value={form.source ?? "admin_curated"} onChange={(event) => updateField("source", event.target.value as CatalogRecord["source"])} className="field">
                {catalogSources.map((source) => <option key={source} value={source}>{source}</option>)}
              </select>
            </Field>
            <Field label="Seller / Merchant"><input value={form.seller ?? ""} onChange={(event) => updateField("seller", event.target.value)} className="field" /></Field>
            <Field label="Price"><input type="number" min="0" step="0.01" value={form.price ?? 0} onChange={(event) => updateField("price", Number(event.target.value))} className="field" /></Field>
            <Field label="Affiliate URL"><input value={form.affiliate_url ?? ""} onChange={(event) => updateField("affiliate_url", event.target.value)} className="field" /></Field>
            <Field label="Product URL"><input value={form.product_url ?? ""} onChange={(event) => updateField("product_url", event.target.value)} className="field" /></Field>
            <Field label="Image URL"><input value={form.image ?? ""} onChange={(event) => updateField("image", event.target.value)} className="field" /></Field>
            <Field label="Availability">
              <select value={form.availability ?? "unknown"} onChange={(event) => updateField("availability", event.target.value as CatalogRecord["availability"])} className="field">
                {[
                  "in_stock",
                  "low_stock",
                  "out_of_stock",
                  "discontinued",
                  "preorder",
                  "unknown",
                ].map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </Field>
            <Field label="Condition"><input value={form.condition ?? "New"} onChange={(event) => updateField("condition", event.target.value)} className="field" /></Field>
            <Field label="Release year"><input type="number" value={form.release_year ?? ""} onChange={(event) => updateField("release_year", Number(event.target.value) || undefined)} className="field" /></Field>
            <Field label="Featured"><input type="checkbox" checked={Boolean(form.featured)} onChange={(event) => updateField("featured", event.target.checked)} className="mt-4 h-5 w-5 accent-amber-500" /></Field>
            <Field label="Active"><input type="checkbox" checked={Boolean(form.active)} onChange={(event) => updateField("active", event.target.checked)} className="mt-4 h-5 w-5 accent-amber-500" /></Field>
            <Field label="Vintage"><input type="checkbox" checked={Boolean(form.vintage)} onChange={(event) => updateField("vintage", event.target.checked)} className="mt-4 h-5 w-5 accent-amber-500" /></Field>
            <Field label="Collectible"><input type="checkbox" checked={Boolean(form.collectible)} onChange={(event) => updateField("collectible", event.target.checked)} className="mt-4 h-5 w-5 accent-amber-500" /></Field>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-zinc-400">Description</label>
            <textarea value={form.description ?? ""} onChange={(event) => updateField("description", event.target.value)} className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none ring-0 placeholder:text-zinc-500" />
          </div>

          <div className="mt-6 flex gap-3">
            <button type="submit" disabled={!canSubmit} className="rounded-full border border-amber-300/40 bg-amber-300/10 px-5 py-3 text-xs uppercase tracking-[0.28em] text-amber-100 disabled:cursor-not-allowed disabled:opacity-50">Save record</button>
            <a href="/admin/catalog" className="rounded-full border border-white/15 px-5 py-3 text-xs uppercase tracking-[0.28em] text-zinc-200">Back to catalog</a>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-zinc-400">{label}</span>
      {children}
    </label>
  );
}
