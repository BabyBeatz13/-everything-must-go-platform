import { AccountLayout } from "../../../components/account/AccountLayout";
import { SectionCard } from "../../../components/account/SectionCard";

const recentlyViewed = [
  "Universal Audio Apollo Twin",
  "North Face Summit Shell",
  "Black Seed Oil Deluxe",
  "Velvet Lounge Sofa",
];

export default function RecentlyViewedPage() {
  return (
    <AccountLayout
      title="Recently Viewed Products"
      description="Your recent marketplace browsing history is kept in the customer account layer for faster resumption and personalization."
    >
      <SectionCard
        title="Recent browsing"
        description="Prepared to integrate with a real Supabase-backed history table later."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {recentlyViewed.map((item) => (
            <div key={item} className="rounded-[24px] border border-white/10 bg-black/30 p-4 text-sm text-white">
              {item}
            </div>
          ))}
        </div>
      </SectionCard>
    </AccountLayout>
  );
}
