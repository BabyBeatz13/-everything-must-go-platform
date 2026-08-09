"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { MarketplaceCard } from "@/components/marketplace/MarketplaceCard";
import { ProductEditorForm } from "@/components/seller/ProductEditorForm";
import { SellerShell } from "@/components/seller/SellerShell";
import { createSellerProductPortal, type SellerProductForm } from "@/lib/seller-portal";

const initialState: SellerProductForm = {
  title: "",
  description: "",
  category: "Home & Furniture",
  subcategory: "",
  brand: "",
  sku: "",
  status: "draft",
  price: 0,
  compareAtPrice: 0,
  inventoryQuantity: 0,
  condition: "new",
  shippingPrice: 0,
  freeShipping: false,
  featured: false,
  slug: "",
  variantsJson: "[]",
  imagesCsv: "",
  shippingClass: "standard",
  weightGrams: 0,
  seoTitle: "",
  seoDescription: "",
};

export default function NewSellerProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<SellerProductForm>(initialState);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function save(mode: "draft" | "active") {
    setSaving(true);
    setMessage(null);

    const result = await createSellerProductPortal({ ...form, status: mode });
    if (!result.ok) {
      setMessage(result.error ?? "Unable to create product right now.");
      setSaving(false);
      return;
    }

    setMessage(mode === "draft" ? "Draft saved." : "Listing published.");
    router.push("/seller/products");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void save("active");
  }

  return (
    <SellerShell title="Create product listing" subtitle="Add catalog details, inventory, variants, shipping, and SEO metadata.">
      <MarketplaceCard title="Marketplace product form" description="Structured product setup for draft or direct publish flows.">
        <ProductEditorForm
          value={form}
          onChange={setForm}
          onSubmit={submit}
          submitLabel="Publish listing"
          secondaryLabel="Save draft"
          onSecondaryAction={() => void save("draft")}
          disabled={saving}
        />
        {message ? <p className="mt-3 text-sm text-amber-100">{message}</p> : null}
      </MarketplaceCard>
    </SellerShell>
  );
}
