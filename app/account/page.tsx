import { AccountLayout } from "../../components/account/AccountLayout";
import { AccountMetric } from "../../components/account/AccountMetric";
import { SectionCard } from "../../components/account/SectionCard";

const statCards = [
  { label: "Saved items", value: "12" },
  { label: "Addresses", value: "3" },
  { label: "Recent views", value: "9" },
  { label: "Saved cart", value: "$1,240" },
];

export default function AccountDashboardPage() {
  return (
    <AccountLayout
      title="Account Dashboard"
      description="Manage your marketplace profile, saved products, delivery details, and wishlist from one responsive customer workspace."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <AccountMetric key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      <SectionCard
        title="Marketplace snapshot"
        description="Your customer account is ready for future marketplace expansion, identity sync, and seller-aware product workflows."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[24px] border border-white/10 bg-black/25 p-4">
            <p className="text-sm text-zinc-300">Wishlist</p>
            <p className="mt-2 text-lg font-semibold text-white">Luxury picks curated for your personal style</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-black/25 p-4">
            <p className="text-sm text-zinc-300">Saved Cart</p>
            <p className="mt-2 text-lg font-semibold text-white">Premium bundles ready for checkout</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Growing foundation"
        description="This workspace is intentionally structured to support future seller accounts without removing customer account functionality."
      >
        <div className="space-y-3 text-sm text-zinc-200">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">Customer authentication scaffold ready for Supabase.</div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">Protected account routes and reusable account components prepared for expansion.</div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">Separate customer and seller architecture path remains open.</div>
        </div>
      </SectionCard>
    </AccountLayout>
  );
}
