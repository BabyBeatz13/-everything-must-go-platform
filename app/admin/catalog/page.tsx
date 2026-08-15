"use client";

import { useEffect, useMemo, useState } from "react";
import { getCurrentUserRole } from "@/lib/client-auth";
import { catalogCategories, catalogSources, getCatalogRecords, saveCatalogRecords, type CatalogRecord } from "@/lib/catalog";

export default function AdminCatalogPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<CatalogRecord[]>([]);

  useEffect(() => {
    void (async () => {
      const role = await getCurrentUserRole();
      if (role !== "admin") {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      setAuthorized(true);
      setRecords(getCatalogRecords());
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => ({
    total: records.length,
    active: records.filter((record) => record.active).length,
    affiliate: records.filter((record) => record.source === "affiliate").length,
    admin: records.filter((record) => record.source === "admin_curated").length,
    vintage: records.filter((record) => record.vintage).length,
  }), [records]);

  if (loading) {
    return <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] p-8 text-sm uppercase tracking-[0.3em] text-amber-100">Loading admin catalog...</main>;
  }

  if (!authorized) {
    return <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] p-8 text-sm uppercase tracking-[0.3em] text-rose-200">Unauthorized: admin access required.</main>;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[30px] border border-amber-300/20 bg-white/[0.03] p-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Marketplace catalog</p>
            <h1 className="mt-2 text-3xl font-semibold">Admin catalog management</h1>
          </div>
          <a href="/admin/catalog/new" className="rounded-full border border-amber-300/40 bg-amber-300/10 px-5 py-3 text-xs uppercase tracking-[0.3em] text-amber-100 transition hover:bg-amber-300/20">Add product</a>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Total" value={String(stats.total)} />
          <StatCard label="Active" value={String(stats.active)} />
          <StatCard label="Affiliate" value={String(stats.affiliate)} />
          <StatCard label="Admin" value={String(stats.admin)} />
          <StatCard label="Vintage" value={String(stats.vintage)} />
        </div>

        <div className="mt-8 rounded-[28px] border border-white/10 bg-black/30 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-[10px] uppercase tracking-[0.38em] text-zinc-400">Catalog records</p>
            <button
              type="button"
              onClick={() => saveCatalogRecords(records)}
              className="rounded-full border border-white/15 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-zinc-200 hover:border-amber-300/30"
            >
              Save local catalog
            </button>
          </div>

          <div className="space-y-3">
            {records.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-zinc-400">No catalog records yet. Add a manual entry or import via the supported pipeline.</div>
            ) : (
              records.map((record) => (
                <div key={record.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{record.title}</p>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">{record.category} • {record.source}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-amber-300">${record.price.toFixed(2)}</p>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">{record.availability}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                    <span className="rounded-full border border-white/10 px-2 py-1">{record.brand}</span>
                    {record.vintage && <span className="rounded-full border border-amber-300/30 px-2 py-1 text-amber-100">Vintage</span>}
                    {record.featured && <span className="rounded-full border border-amber-300/30 px-2 py-1 text-amber-100">Featured</span>}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <a href={`/admin/catalog/${record.id}`} className="rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-amber-100">Edit</a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/35 p-4">
      <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-400">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
