import { FormField } from "../../../../components/marketplace/FormField";
import { MarketplaceCard } from "../../../../components/marketplace/MarketplaceCard";
import { marketplaceCategoryOptions, productConditionOptions } from "../../../../lib/marketplace-data";

export default function NewSellerProductPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#090909_0%,#111111_35%,#0b0b0b_100%)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[30px] border border-amber-300/20 bg-white/[0.03] p-6">
          <p className="text-[10px] uppercase tracking-[0.42em] text-amber-200/80">Seller listing</p>
          <h1 className="mt-2 text-3xl font-semibold">Create product listing</h1>
        </div>

        <MarketplaceCard title="Marketplace product form" description="Add a new product with pricing, shipping, condition, and inventory details.">
          <form className="grid gap-4 md:grid-cols-2">
            <FormField label="Product title">
              <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" defaultValue="Brass Floor Lamp" />
            </FormField>
            <FormField label="Seller ID">
              <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" defaultValue="seller-01" />
            </FormField>
            <FormField label="Category" fullWidth>
              <select className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" defaultValue="Home & Furniture">
                {marketplaceCategoryOptions.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Subcategory">
              <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" defaultValue="Lamps" />
            </FormField>
            <FormField label="Brand">
              <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" defaultValue="Velvet & Vine" />
            </FormField>
            <FormField label="SKU">
              <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" defaultValue="VVM-LAMP-001" />
            </FormField>
            <FormField label="Price">
              <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" type="number" defaultValue={289} />
            </FormField>
            <FormField label="Compare-at price">
              <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" type="number" defaultValue={349} />
            </FormField>
            <FormField label="Inventory quantity">
              <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" type="number" defaultValue={10} />
            </FormField>
            <FormField label="Condition">
              <select className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" defaultValue="New">
                {productConditionOptions.map((condition) => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Shipping price">
              <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" type="number" defaultValue={18} />
            </FormField>
            <FormField label="Free shipping">
              <select className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" defaultValue="No">
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </FormField>
            <FormField label="Featured flag" fullWidth>
              <select className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" defaultValue="Yes">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </FormField>
            <FormField label="Product images" fullWidth>
              <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" defaultValue="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80" />
            </FormField>
            <FormField label="Description" fullWidth>
              <textarea className="min-h-32 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" defaultValue="Warm ambient floor lamp with a premium brass finish and linen shade." />
            </FormField>
            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button type="button" className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white">
                Save draft
              </button>
              <button type="submit" className="rounded-full bg-amber-300 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.2em] text-black">
                Publish listing
              </button>
            </div>
          </form>
        </MarketplaceCard>
      </div>
    </main>
  );
}
