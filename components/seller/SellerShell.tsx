"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type SellerShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  rightSlot?: ReactNode;
};

const sellerNav = [
  { href: "/seller/dashboard", label: "Dashboard" },
  { href: "/seller/products", label: "Products" },
  { href: "/seller/orders", label: "Orders" },
  { href: "/seller/shipping", label: "Shipping" },
  { href: "/seller/cases", label: "Cases" },
  { href: "/seller/customers", label: "Customers" },
  { href: "/seller/analytics", label: "Analytics" },
  { href: "/seller/earnings", label: "Earnings" },
  { href: "/seller/payments", label: "Payments" },
  { href: "/seller/profile", label: "Store Profile" },
];

export function SellerShell({ title, subtitle, children, rightSlot }: SellerShellProps) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[30px] border border-amber-300/20 bg-white/[0.03] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Seller workspace</p>
              <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
              <p className="mt-2 text-sm text-zinc-300">{subtitle}</p>
            </div>
            {rightSlot}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4">
            <nav className="space-y-2">
              {sellerNav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-2xl px-3 py-3 text-sm transition ${active ? "border border-amber-300/45 bg-amber-300/10 text-amber-100" : "border border-white/8 text-zinc-200 hover:border-amber-300/40 hover:text-amber-100"}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <section className="space-y-5">{children}</section>
        </div>
      </div>
    </main>
  );
}
