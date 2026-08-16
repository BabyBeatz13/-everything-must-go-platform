"use client";

import { FormEvent } from "react";
import { FormField } from "@/components/marketplace/FormField";
import { marketplaceCategoryOptions, productConditionOptions } from "@/lib/marketplace-data";
import type { SellerProductForm } from "@/lib/seller-portal";

type ProductEditorFormProps = {
  value: SellerProductForm;
  onChange: (next: SellerProductForm) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitLabel: string;
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
  dangerLabel?: string;
  onDangerAction?: () => void;
  disabled?: boolean;
};

const statusOptions: SellerProductForm["status"][] = ["draft", "active", "paused", "archived"];

export function ProductEditorForm({
  value,
  onChange,
  onSubmit,
  submitLabel,
  secondaryLabel,
  onSecondaryAction,
  dangerLabel,
  onDangerAction,
  disabled,
}: ProductEditorFormProps) {
  const update = <K extends keyof SellerProductForm>(key: K, fieldValue: SellerProductForm[K]) => {
    onChange({ ...value, [key]: fieldValue });
  };

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
      <FormField label="Product title">
        <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" value={value.title} onChange={(e) => update("title", e.target.value)} required />
      </FormField>
      <FormField label="Status">
        <select className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" value={value.status} onChange={(e) => update("status", e.target.value as SellerProductForm["status"])}>
          {statusOptions.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </FormField>
      <FormField label="Category">
        <select className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" value={value.category} onChange={(e) => update("category", e.target.value)}>
          {marketplaceCategoryOptions.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </FormField>
      <FormField label="Subcategory">
        <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" value={value.subcategory} onChange={(e) => update("subcategory", e.target.value)} />
      </FormField>
      <FormField label="Brand">
        <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" value={value.brand} onChange={(e) => update("brand", e.target.value)} />
      </FormField>
      <FormField label="Model">
        <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" value={value.model} onChange={(e) => update("model", e.target.value)} placeholder="Model or variant" />
      </FormField>
      <FormField label="SKU">
        <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" value={value.sku} onChange={(e) => update("sku", e.target.value)} required />
      </FormField>
      <FormField label="Price">
        <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" type="number" step="0.01" min={0} value={value.price} onChange={(e) => update("price", Number(e.target.value || 0))} required />
      </FormField>
      <FormField label="Compare-at price">
        <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" type="number" step="0.01" min={0} value={value.compareAtPrice} onChange={(e) => update("compareAtPrice", Number(e.target.value || 0))} />
      </FormField>
      <FormField label="Inventory quantity">
        <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" type="number" min={0} value={value.inventoryQuantity} onChange={(e) => update("inventoryQuantity", Number(e.target.value || 0))} required />
      </FormField>
      <FormField label="Condition">
        <select className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" value={value.condition} onChange={(e) => update("condition", e.target.value.toLowerCase() as SellerProductForm["condition"])}>
          {productConditionOptions.map((condition) => (
            <option key={condition} value={condition.toLowerCase()}>{condition}</option>
          ))}
        </select>
      </FormField>
      <FormField label="Availability">
        <select className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" value={value.availability} onChange={(e) => update("availability", e.target.value as SellerProductForm["availability"])}>
          <option value="in_stock">In stock</option>
          <option value="low_stock">Low stock</option>
          <option value="out_of_stock">Out of stock</option>
          <option value="unknown">Unknown</option>
        </select>
      </FormField>
      <FormField label="Year / Era">
        <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" value={value.yearEra} onChange={(e) => update("yearEra", e.target.value)} placeholder="e.g. 1990s, 2026, Fall 2025" />
      </FormField>
      <FormField label="Tags (comma-separated)">
        <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" value={value.tagsCsv} onChange={(e) => update("tagsCsv", e.target.value)} placeholder="cuban link, mens jewelry, vintage" />
      </FormField>
      <FormField label="Shipping price">
        <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" type="number" step="0.01" min={0} value={value.shippingPrice} onChange={(e) => update("shippingPrice", Number(e.target.value || 0))} />
      </FormField>
      <FormField label="Shipping class">
        <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" value={value.shippingClass} onChange={(e) => update("shippingClass", e.target.value)} placeholder="Standard, bulky, oversized..." />
      </FormField>
      <FormField label="Weight (grams)">
        <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" type="number" min={0} value={value.weightGrams} onChange={(e) => update("weightGrams", Number(e.target.value || 0))} />
      </FormField>
      <FormField label="Product slug">
        <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" value={value.slug} onChange={(e) => update("slug", e.target.value)} placeholder="luxury-floor-lamp" />
      </FormField>
      <FormField label="Free shipping">
        <select className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" value={value.freeShipping ? "Yes" : "No"} onChange={(e) => update("freeShipping", e.target.value === "Yes")}>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </FormField>
      <FormField label="Featured flag">
        <select className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" value={value.featured ? "Yes" : "No"} onChange={(e) => update("featured", e.target.value === "Yes")}>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </FormField>
      <FormField label="Product images (comma-separated URLs)" fullWidth>
        <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" value={value.imagesCsv} onChange={(e) => update("imagesCsv", e.target.value)} />
      </FormField>
      <FormField label="Primary image index" fullWidth>
        <input
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
          type="number"
          min={0}
          value={value.imagePrimaryIndex}
          onChange={(e) => update("imagePrimaryIndex", Math.max(0, Number(e.target.value || 0)))}
        />
      </FormField>
      <FormField label="Variants JSON" fullWidth>
        <textarea className="min-h-24 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-xs text-white outline-none" value={value.variantsJson} onChange={(e) => update("variantsJson", e.target.value)} />
      </FormField>
      <FormField label="SEO title">
        <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" value={value.seoTitle} onChange={(e) => update("seoTitle", e.target.value)} />
      </FormField>
      <FormField label="SEO description">
        <input className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" value={value.seoDescription} onChange={(e) => update("seoDescription", e.target.value)} />
      </FormField>
      <FormField label="Description" fullWidth>
        <textarea className="min-h-32 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" value={value.description} onChange={(e) => update("description", e.target.value)} required />
      </FormField>
      <div className="flex flex-wrap justify-between gap-3 pt-2 md:col-span-2">
        {dangerLabel && onDangerAction ? (
          <button type="button" onClick={onDangerAction} disabled={disabled} className="rounded-full border border-rose-400/30 bg-rose-500/10 px-5 py-2.5 text-sm font-semibold text-rose-200 disabled:opacity-70">
            {dangerLabel}
          </button>
        ) : <span />}
        <div className="flex gap-3">
          {secondaryLabel && onSecondaryAction ? (
            <button type="button" onClick={onSecondaryAction} disabled={disabled} className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-70">
              {secondaryLabel}
            </button>
          ) : null}
          <button type="submit" disabled={disabled} className="rounded-full bg-amber-300 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.2em] text-black disabled:opacity-70">
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
