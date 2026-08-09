import Link from "next/link";
import { FormField } from "@/components/marketplace/FormField";
import { MarketplaceCard } from "@/components/marketplace/MarketplaceCard";

export default function SellerApplyPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[30px] border border-amber-300/20 bg-white/[0.03] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Seller marketplace</p>
          <h1 className="mt-2 text-3xl font-semibold">Apply to become a seller</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-300">
            Join the Everything Must Go marketplace and list premium products in a dedicated seller storefront.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <MarketplaceCard title="Seller application" description="Share your storefront details and approval status for admin review.">
            <form className="grid gap-4 md:grid-cols-2">
              <FormField label="Business name">
                <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" defaultValue="Velvet & Vine Studio" />
              </FormField>
              <FormField label="Store name">
                <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" defaultValue="Velvet & Vine" />
              </FormField>
              <FormField label="Primary contact email" fullWidth>
                <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" type="email" defaultValue="seller@velvetandvine.com" />
              </FormField>
              <FormField label="Seller logo URL" fullWidth>
                <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" defaultValue="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=500&q=80" />
              </FormField>
              <FormField label="Store bio" fullWidth>
                <textarea className="min-h-32 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" defaultValue="Boutique home and lifestyle seller focused on curated decor, rare finds, and elevated essentials." />
              </FormField>
              <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-sm text-zinc-400">Status: Pending review</div>
                <div className="flex gap-3">
                  <Link href="/seller/onboarding" className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white">
                    Complete onboarding
                  </Link>
                  <button type="submit" className="rounded-full bg-amber-300 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.2em] text-black">
                    Submit application
                  </button>
                </div>
              </div>
            </form>
          </MarketplaceCard>

          <MarketplaceCard title="Seller checklist" description="Prepare these items before approval.">
            <ul className="space-y-3 text-sm text-zinc-200">
              <li className="rounded-2xl border border-white/10 bg-black/25 p-3">Store identity and approved brand naming.</li>
              <li className="rounded-2xl border border-white/10 bg-black/25 p-3">Shipping policy and fulfillment details.</li>
              <li className="rounded-2xl border border-white/10 bg-black/25 p-3">Inventory and price controls for each product.</li>
              <li className="rounded-2xl border border-white/10 bg-black/25 p-3">Compliance with vendor and product standards.</li>
              <li className="rounded-2xl border border-white/10 bg-black/25 p-3">Ability to manage dashboard approvals and edits.</li>
            </ul>
          </MarketplaceCard>
        </div>
      </div>
    </main>
  );
}
