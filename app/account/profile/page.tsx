import { AccountLayout } from "../../../components/account/AccountLayout";
import { SectionCard } from "../../../components/account/SectionCard";

export default function ProfileSettingsPage() {
  return (
    <AccountLayout
      title="Profile Settings"
      description="Update your personal marketplace identity and contact preferences for a more customized shopping experience."
    >
      <SectionCard
        title="Personal information"
        description="Your public and private profile data can be extended later for seller-aware identity workflows."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-zinc-300">
            Full name
            <input className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" value="Luxury Shopper" readOnly />
          </label>
          <label className="text-sm text-zinc-300">
            Email
            <input className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" value="shopper@example.com" readOnly />
          </label>
          <label className="text-sm text-zinc-300 md:col-span-2">
            Preferred style notes
            <textarea className="mt-2 min-h-28 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" defaultValue="I prefer premium tech, luxury home, and wellness-led product categories." />
          </label>
        </div>
      </SectionCard>
    </AccountLayout>
  );
}
