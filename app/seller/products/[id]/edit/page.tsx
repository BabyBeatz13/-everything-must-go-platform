"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MarketplaceCard } from "@/components/marketplace/MarketplaceCard";
import { ProductEditorForm } from "@/components/seller/ProductEditorForm";
import { SellerShell } from "@/components/seller/SellerShell";
import {
  deleteSellerProductPortal,
  getSellerProductByIdPortal,
  updateSellerProductPortal,
  type SellerProductForm,
} from "@/lib/seller-portal";

const blankState: SellerProductForm = {
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

export default function EditSellerProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<SellerProductForm>(blankState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      if (!params.id) {
        setLoading(false);
        return;
      }

      const product = await getSellerProductByIdPortal(params.id);
      if (!product) {
        setMessage("Product not found.");
        setLoading(false);
        return;
      }

      setForm({
        title: String(product.title ?? ""),
        description: String(product.description ?? ""),
        category: String(product.category ?? "Home & Furniture"),
        subcategory: String(product.subcategory ?? ""),
        brand: String(product.brand ?? ""),
        sku: String(product.sku ?? ""),
        status: String(product.status ?? "draft") as SellerProductForm["status"],
        price: Number(product.price ?? 0),
        compareAtPrice: Number(product.compare_at_price ?? 0),
        inventoryQuantity: Number(product.inventory_quantity ?? 0),
        condition: String(product.condition ?? "new") as SellerProductForm["condition"],
        shippingPrice: Number(product.shipping_price ?? 0),
        freeShipping: Boolean(product.free_shipping),
        featured: Boolean(product.featured),
        slug: String(product.slug ?? ""),
        variantsJson: JSON.stringify(product.variants ?? [], null, 2),
        imagesCsv: Array.isArray(product.product_images) ? product.product_images.join(", ") : "",
        shippingClass: String(product.shipping_class ?? "standard"),
        weightGrams: Number(product.weight_grams ?? 0),
        seoTitle: String(product.seo_title ?? ""),
        seoDescription: String(product.seo_description ?? ""),
      });

      setLoading(false);
    })();
  }, [params.id]);

  async function save(mode: "draft" | "active") {
    if (!params.id) return;

    setSaving(true);
    setMessage(null);
    const result = await updateSellerProductPortal(params.id, { ...form, status: mode });
    if (!result.ok) {
      setMessage(result.error ?? "Unable to update listing.");
      setSaving(false);
      return;
    }

    setMessage(mode === "draft" ? "Draft saved." : "Listing updated.");
    router.push("/seller/products");
  }

  async function removeProduct() {
    if (!params.id) return;

    setSaving(true);
    setMessage(null);
    const result = await deleteSellerProductPortal(params.id);
    if (!result.ok) {
      setMessage(result.error ?? "Unable to delete product.");
      setSaving(false);
      return;
    }

    router.push("/seller/products");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void save("active");
  }

  return (
    <SellerShell title="Edit product" subtitle="Control listing state, pricing, variants, and SEO before publishing updates.">
      <MarketplaceCard title="Product management" description="Advanced product lifecycle and inventory controls.">
        {loading ? <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-zinc-300">Loading product...</p> : null}
        {!loading ? (
          <ProductEditorForm
            value={form}
            onChange={setForm}
            onSubmit={submit}
            submitLabel="Update listing"
            secondaryLabel="Save draft"
            onSecondaryAction={() => void save("draft")}
            dangerLabel="Delete product"
            onDangerAction={() => void removeProduct()}
            disabled={saving}
          />
        ) : null}
        {message ? <p className="mt-3 text-sm text-amber-100">{message}</p> : null}
      </MarketplaceCard>
    </SellerShell>
  );
}
