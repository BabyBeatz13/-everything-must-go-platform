import { AccountLayout } from "../../../components/account/AccountLayout";
import { SectionCard } from "../../../components/account/SectionCard";

const savedAddresses = [
  {
    label: "Primary Residence",
    details: "12 Goldcrest Lane, Beverly Hills, CA 90210",
  },
  {
    label: "Studio Flat",
    details: "47 Gallery Way, New York, NY 10012",
  },
];

export default function SavedAddressesPage() {
  return (
    <AccountLayout
      title="Saved Addresses"
      description="Manage delivery destinations and house your shipping preferences for premium marketplace fulfillment."
    >
      <SectionCard
        title="Address book"
        description="Your packaged addresses are ready for checkout and cart resolution workflows."
      >
        <div className="space-y-3">
          {savedAddresses.map((address) => (
            <div key={address.label} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
              <p className="text-sm font-semibold text-white">{address.label}</p>
              <p className="mt-2 text-sm text-zinc-300">{address.details}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </AccountLayout>
  );
}
