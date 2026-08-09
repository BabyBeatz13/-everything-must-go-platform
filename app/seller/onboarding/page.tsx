import Link from "next/link";
import { FormField } from "@/components/marketplace/FormField";
import { MarketplaceCard } from "@/components/marketplace/MarketplaceCard";

export default function SellerOnboardingPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[30px] border border-amber-300/20 bg-white/[0.03] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Seller onboarding</p>
          <h1 className="mt-2 text-3xl font-semibold">Seller profile setup</h1>
        </div>

        <MarketplaceCard title="Store setup" description="Complete your seller profile, shipping setup, and listing expectations.">
          <form className="grid gap-4 md:grid-cols-2">
            <FormField label="Store name">
              <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" defaultValue="Velvet & Vine" />
            </FormField>
            <FormField label="Seller approval status">
              <select className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" defaultValue="Pending">
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
                <option>Suspended</option>
              </select>
            </FormField>
            <FormField label="Logo URL" fullWidth>
              <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" defaultValue="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=500&q=80" />
            </FormField>
            <FormField label="Business email" fullWidth>
              <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" type="email" defaultValue="seller@velvetandvine.com" />
            </FormField>
            <FormField label="Bio / About" fullWidth>
              <textarea className="min-h-32 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" defaultValue="Curated home accents, vintage treasures, and design-led essentials for elevated living spaces." />
            </FormField>
            <FormField label="Shipping policy" fullWidth>
              <textarea className="min-h-24 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" defaultValue="US orders ship within 3-5 business days. International shipping is available on select items with calculated rates." />
            </FormField>
            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <Link href="/seller/dashboard" className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white">
                Go to dashboard
              </Link>
              <button type="submit" className="rounded-full bg-amber-300 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.2em] text-black">
                Save profile
              </button>
            </div>
          </form>
        </MarketplaceCard>
      </div>
    </main>
  );
}
