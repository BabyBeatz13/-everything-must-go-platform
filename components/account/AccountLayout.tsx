import type { ReactNode } from "react";

const navItems = [
  { href: "/account", label: "Dashboard" },
  { href: "/account/profile", label: "Profile" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/recently-viewed", label: "Recently Viewed" },
  { href: "/account/orders", label: "Order History" },
  { href: "/account/cart", label: "Saved Cart" },
];

type AccountLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AccountLayout({ title, description, children }: AccountLayoutProps) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[30px] border border-white/10 bg-white/[0.04] p-5">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Customer accounts</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-300">{description}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block rounded-2xl border border-white/8 px-3 py-3 text-sm text-zinc-200 transition hover:border-amber-300/40 hover:text-amber-100"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          <div className="space-y-5">{children}</div>
        </div>
      </div>
    </main>
  );
}
