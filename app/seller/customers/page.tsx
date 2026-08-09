"use client";

import { useEffect, useState } from "react";
import { SellerShell } from "@/components/seller/SellerShell";
import { getSellerCustomersPortal } from "@/lib/seller-portal";

type SellerCustomer = {
  customerId: string;
  fullName: string;
  email: string;
  totalOrders: number;
  itemsPurchased: number;
  lastOrderAt: string;
  orderNumbers: string[];
};

export default function SellerCustomersPage() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<SellerCustomer[]>([]);

  useEffect(() => {
    void (async () => {
      const rows = (await getSellerCustomersPortal()) as SellerCustomer[];
      setCustomers(rows.sort((a, b) => b.lastOrderAt.localeCompare(a.lastOrderAt)));
      setLoading(false);
    })();
  }, []);

  return (
    <SellerShell title="Customer management" subtitle="View buyer order history, repeat order frequency, and high-intent shoppers.">
      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Total customers" value={String(customers.length)} />
        <Metric label="Total orders" value={String(customers.reduce((sum, row) => sum + row.totalOrders, 0))} />
        <Metric label="Items purchased" value={String(customers.reduce((sum, row) => sum + row.itemsPurchased, 0))} />
      </div>

      <div className="space-y-3">
        {loading ? <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-zinc-300">Loading customers...</p> : null}
        {!loading && customers.length === 0 ? <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-zinc-300">No customers yet.</p> : null}
        {customers.map((customer) => (
          <div key={customer.customerId} className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-white">{customer.fullName}</p>
                <p className="text-sm text-zinc-300">{customer.email}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Last order</p>
                <p className="text-sm text-white">{new Date(customer.lastOrderAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-200">{customer.totalOrders} orders</span>
              <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-200">{customer.itemsPurchased} items</span>
              <span className="rounded-full border border-amber-300/35 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-100">Messaging placeholder</span>
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-zinc-500">Order refs: {customer.orderNumbers.filter(Boolean).join(", ") || "None"}</p>
          </div>
        ))}
      </div>
    </SellerShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
      <p className="text-[10px] uppercase tracking-[0.35em] text-amber-200/80">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}
