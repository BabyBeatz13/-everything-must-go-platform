import { AccountLayout } from "@/components/account/AccountLayout";
import { MarketplaceCard } from "@/components/marketplace/MarketplaceCard";
import { StatusBadge } from "@/components/marketplace/StatusBadge";
import { orderHistory } from "@/lib/marketplace-data";

export default function OrderHistoryPage() {
  return (
    <AccountLayout
      title="Order History"
      description="Track package status, recent purchases, and delivery timelines for your marketplace account."
    >
      <MarketplaceCard title="Recent orders" description="Your fulfillment and shipment history stays in one place for easy follow-up.">
        <div className="space-y-3">
          {orderHistory.map((order) => (
            <div key={order.id} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{order.orderNumber}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.28em] text-zinc-400">{new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="mt-4 flex flex-col gap-2 text-sm text-zinc-300 md:flex-row md:items-center md:justify-between">
                <span>{order.items} item{order.items > 1 ? "s" : ""}</span>
                <span className="font-semibold text-white">Total: ${order.total.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </MarketplaceCard>
    </AccountLayout>
  );
}
