"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/sellers", label: "Sellers" },
  { href: "/admin/listings", label: "Products/Listings" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/shipping", label: "Shipping" },
  { href: "/admin/shipments", label: "Shipments" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/payouts", label: "Payouts" },
  { href: "/admin/refunds", label: "Refunds" },
  { href: "/admin/returns", label: "Returns" },
  { href: "/admin/cases", label: "Cases/Disputes" },
  { href: "/admin/authenticity", label: "Authenticity" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/promotions", label: "Promotions" },
  { href: "/admin/notifications", label: "Notifications" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/risk", label: "Risk" },
  { href: "/admin/settings/fees", label: "Settings" },
];

export function AdminShell() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden min-h-screen w-72 border-r border-white/10 bg-black/45 p-4 lg:block">
      <div className="rounded-[28px] border border-amber-300/20 bg-white/[0.04] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-300/40 bg-gradient-to-br from-amber-200/90 to-amber-500/40 text-[10px] font-black tracking-[0.24em] text-black">EMG</div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.42em] text-amber-200/80">Marketplace</p>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">Admin</h2>
          </div>
        </div>

        <div className="mt-6 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-2xl px-3 py-2 text-sm transition ${
                  active
                    ? "border border-amber-300/30 bg-amber-300/10 text-amber-100"
                    : "text-zinc-300 hover:bg-white/[0.03] hover:text-white"
                }`}
              >
                <span>{item.label}</span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">{item.href.includes("settings") ? "cfg" : "view"}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
