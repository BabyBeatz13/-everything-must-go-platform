"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { buildCatalogRecord, getCatalogRecords, saveCatalogRecords, type CatalogRecord } from "@/lib/catalog";

export default function AdminCatalogDetailPage() {
  const params = useParams<{ id: string }>();
  const [record, setRecord] = useState<CatalogRecord | null>(null);

  useEffect(() => {
    const all = getCatalogRecords();
    const match = all.find((entry) => entry.id === params.id) ?? null;
    setRecord(match);
  }, [params.id]);

  if (!record) {
    return <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] p-8 text-sm uppercase tracking-[0.3em] text-white">Catalog item not found.</main>;
  }

  const updateField = <K extends keyof CatalogRecord>(key: K, value: CatalogRecord[K]) => {
    setRecord((current) => (current ? { ...current, [key]: value } : current));
  };

  const saveChanges = () => {
    const all = getCatalogRecords();
    const next = all.map((entry) =>
      entry.id === record.id
        ? ({ ...record, status: (record.active ? "active" : "inactive") as CatalogRecord["status"] } as CatalogRecord)
        : entry,
    );
    saveCatalogRecords(next);
    window.location.href = "/admin/catalog";
  };

  const metadata = useMemo(() => [
    ["Source", record.source],
    ["Brand", record.brand],
    ["Category", record.category],
    ["Seller", record.seller],
    ["Availability", record.availability],
    ["Authenticity", record.authenticity_status],
  ], [record]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[30px] border border-amber-300/20 bg-white/[0.03] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Catalog item</p>
          <h1 className="mt-2 text-3xl font-semibold">{record.title}</h1>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-black/30 p-5">
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-zinc-400">Title</span>
                <input value={record.title} onChange={(event) => updateField("title", event.target.value)} className="field" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-zinc-400">Brand</span>
                <input value={record.brand} onChange={(event) => updateField("brand", event.target.value)} className="field" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-zinc-400">Category</span>
                <input value={record.category} onChange={(event) => updateField("category", event.target.value)} className="field" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-zinc-400">Price</span>
                <input type="number" step="0.01" value={record.price} onChange={(event) => updateField("price", Number(event.target.value))} className="field" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-zinc-400">Affiliate URL</span>
                <input value={record.affiliate_url ?? ""} onChange={(event) => updateField("affiliate_url", event.target.value || null)} className="field" />
              </label>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/30 p-5">
            <div className="grid gap-3">
              {metadata.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm">
                  <span className="text-zinc-400">{label}</span>
                  <span className="text-white">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[28px] border border-white/10 bg-black/30 p-5">
          <label className="block">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-zinc-400">Description</span>
            <textarea value={record.description} onChange={(event) => updateField("description", event.target.value)} className="min-h-[140px] w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none ring-0" />
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={saveChanges} className="rounded-full border border-amber-300/40 bg-amber-300/10 px-5 py-3 text-xs uppercase tracking-[0.28em] text-amber-100">Save</button>
          <a href="/admin/catalog" className="rounded-full border border-white/15 px-5 py-3 text-xs uppercase tracking-[0.28em] text-zinc-200">Back</a>
        </div>
      </div>
    </main>
  );
}
