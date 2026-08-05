import { AccountLayout } from "../../../components/account/AccountLayout";
import { SectionCard } from "../../../components/account/SectionCard";

const wishlist = [
  "iPhone 16 Pro Max",
  "MacBook Air M4",
  "California King Bed Frame",
  "Focusrite Scarlett 4i4",
];

export default function WishlistPage() {
  return (
    <AccountLayout
      title="Wishlist"
      description="Keep premium items saved for later so your marketplace experience stays personalized and efficient."
    >
      <SectionCard
        title="Saved favorites"
        description="A customer-side wishlist ready to evolve into seller-friendly shareable lists."
      >
        <div className="grid gap-3 md:grid-cols-2">
          {wishlist.map((item) => (
            <div key={item} className="rounded-[24px] border border-white/10 bg-black/30 p-4 text-sm text-white">
              {item}
            </div>
          ))}
        </div>
      </SectionCard>
    </AccountLayout>
  );
}
