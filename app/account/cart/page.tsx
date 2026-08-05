import { AccountLayout } from "../../../components/account/AccountLayout";
import { SectionCard } from "../../../components/account/SectionCard";

const cartItems = [
  { name: "MacBook Air M4", price: "$1,499" },
  { name: "Focusrite Scarlett 4i4", price: "$229" },
  { name: "Luxury Accent Chair", price: "$599" },
];

export default function SavedCartPage() {
  return (
    <AccountLayout
      title="Saved Shopping Cart"
      description="Keep your active premium cart ready to return to and complete when you are ready to shop."
    >
      <SectionCard
        title="Cart snapshot"
        description="This customer cart state is intentionally independent from the seller layer and ready for future marketplace data persistence."
      >
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item.name} className="flex items-center justify-between rounded-[24px] border border-white/10 bg-black/30 p-4 text-sm text-white">
              <span>{item.name}</span>
              <span className="text-amber-100">{item.price}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </AccountLayout>
  );
}
