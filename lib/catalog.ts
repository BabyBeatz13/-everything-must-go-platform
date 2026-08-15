import { buildSearchDocument, type SearchableProduct } from "./search";

export type CatalogSource = "seller" | "affiliate" | "admin_curated" | "merchant_feed";
export type CatalogAvailability = "in_stock" | "low_stock" | "out_of_stock" | "discontinued" | "preorder" | "unknown";
export type CatalogRecordStatus = "active" | "inactive";

export type CatalogJewelryFields = {
  metal?: string | null;
  karat?: string | null;
  weight?: string | null;
  chain_length?: string | null;
  chain_width?: string | null;
  stone?: string | null;
  diamond_type?: string | null;
  carat_weight?: string | null;
  certification?: string | null;
  country_of_origin?: string | null;
};

export type CatalogFragranceFields = {
  fragrance_name?: string | null;
  concentration?: string | null;
  size?: string | null;
  scent_family?: string | null;
  gender?: string | null;
  release_year?: number | null;
  vintage?: boolean;
};

export type CatalogVintageFields = {
  platform?: string | null;
  game_title?: string | null;
  manufacturer?: string | null;
  release_year?: number | null;
  region?: string | null;
  condition?: string | null;
  sealed?: boolean;
  complete_in_box?: boolean;
  media_type?: string | null;
  collectible_status?: string | null;
};

export type CatalogRecord = {
  id: string;
  source: CatalogSource;
  source_id: string | null;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  brand: string;
  model?: string | null;
  sku?: string | null;
  upc?: string | null;
  seller: string;
  seller_slug?: string | null;
  product_url?: string | null;
  affiliate_url?: string | null;
  image: string;
  images: string[];
  price: number;
  compare_at_price?: number | null;
  currency?: string;
  condition: string;
  availability: CatalogAvailability;
  in_stock: boolean;
  active: boolean;
  featured: boolean;
  authenticity_status: string;
  vintage: boolean;
  collectible: boolean;
  release_date?: string | null;
  release_year?: number | null;
  listing_created_at: string;
  source_updated_at?: string | null;
  tags: string[];
  search_keywords: string[];
  jewelry?: CatalogJewelryFields;
  fragrance?: CatalogFragranceFields;
  vintage_fields?: CatalogVintageFields;
  status: CatalogRecordStatus;
  is_test_data?: boolean;
};

export const catalogSources: CatalogSource[] = ["seller", "affiliate", "admin_curated", "merchant_feed"];

export const catalogCategories = [
  "Electronics",
  "Phones",
  "Computers",
  "Gaming",
  "Vintage Gaming",
  "Fashion",
  "Sneakers",
  "Shirts",
  "Fan Apparel",
  "Beauty",
  "Fragrance",
  "Cologne",
  "Perfume",
  "Fine Jewelry",
  "Gold Jewelry",
  "Diamonds",
  "Watches",
  "Luxury Handbags",
  "Bags",
  "Fitness",
  "Health & Wellness",
  "Home",
  "Furniture",
  "Home Decor",
  "Garden",
  "Seeds",
  "Studio Equipment",
  "Music Software",
  "Pet Supplies",
  "Collectibles",
  "Vintage Toys",
  "Wrestling Collectibles",
  "Sports Memorabilia",
  "Trading Cards",
  "Comics",
  "Vinyl",
  "Vintage Electronics",
  "Vintage Fashion",
  "Vintage Furniture",
];

export const adminCatalogStorageKey = "emg-admin-catalog";

function normalizeStringArray(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeOptionalString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

export function buildCatalogRecord(input: Partial<CatalogRecord>): CatalogRecord {
  const title = input.title ?? "Untitled catalog item";
  const category = input.category ?? "Electronics";
  const brand = input.brand ?? "Unbranded";
  const seller = input.seller ?? "Admin catalog";
  const now = new Date().toISOString();
  const tags = Array.from(new Set([...(input.tags ?? []), category, brand, seller, ...(input.search_keywords ?? [])]));
  const searchKeywords = Array.from(
    new Set(
      [...(input.search_keywords ?? []), title, brand, category, input.subcategory ?? "", seller, ...(input.tags ?? [])]
        .filter(Boolean)
        .map((value) => String(value).trim().toLowerCase())
        .filter(Boolean),
    ),
  );

  return {
    id: input.id ?? `catalog-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    source: input.source ?? "admin_curated",
    source_id: input.source_id ?? null,
    title,
    description: input.description ?? "Catalog entry awaiting expanded description.",
    category,
    subcategory: input.subcategory ?? "",
    brand,
    model: input.model ?? null,
    sku: input.sku ?? null,
    upc: input.upc ?? null,
    seller,
    seller_slug: input.seller_slug ?? null,
    product_url: input.product_url ?? null,
    affiliate_url: input.affiliate_url ?? null,
    image: input.image ?? "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
    images: Array.isArray(input.images) && input.images.length > 0 ? input.images : [input.image ?? "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80"],
    price: Number(input.price ?? 0),
    compare_at_price: input.compare_at_price ?? null,
    currency: input.currency ?? "USD",
    condition: input.condition ?? "New",
    availability: input.availability ?? "unknown",
    in_stock: Boolean(input.in_stock),
    active: input.active ?? true,
    featured: Boolean(input.featured),
    authenticity_status: input.authenticity_status ?? "not_required",
    vintage: Boolean(input.vintage),
    collectible: Boolean(input.collectible),
    release_date: input.release_date ?? null,
    release_year: input.release_year ?? null,
    listing_created_at: input.listing_created_at ?? now,
    source_updated_at: input.source_updated_at ?? now,
    tags: Array.from(new Set(tags.map((value) => value.trim()).filter(Boolean))),
    search_keywords: searchKeywords,
    jewelry: input.jewelry ?? undefined,
    fragrance: input.fragrance ?? undefined,
    vintage_fields: input.vintage_fields ?? undefined,
    status: input.status ?? (input.active === false ? "inactive" : "active"),
    is_test_data: input.is_test_data ?? false,
  };
}

export function validateCatalogRecord(record: Partial<CatalogRecord>) {
  const errors: string[] = [];
  if (!record.title || !String(record.title).trim()) errors.push("Title is required.");
  if (!record.category || !String(record.category).trim()) errors.push("Category is required.");
  if (typeof record.price !== "number" || Number.isNaN(record.price) || record.price < 0) errors.push("Price must be a valid non-negative number.");
  if (!record.source) errors.push("Product source is required.");
  if (record.source === "affiliate" && !record.affiliate_url) errors.push("Affiliate URL is required for affiliate records.");
  if (record.product_url && !/^https?:\/\//i.test(record.product_url)) errors.push("Product URL must be a valid http/https URL.");
  if (record.affiliate_url && !/^https?:\/\//i.test(record.affiliate_url)) errors.push("Affiliate URL must be a valid http/https URL.");
  if (record.image && !/^https?:\/\//i.test(record.image)) errors.push("Image URL must be a valid http/https URL.");
  return { valid: errors.length === 0, errors };
}

export function dedupeCatalogRecords(records: CatalogRecord[]) {
  const seen = new Map<string, CatalogRecord>();

  for (const record of records) {
    const candidateKeys = [
      `${record.source}:${record.source_id ?? ""}`,
      `${record.source}:${record.sku ?? ""}`,
      `${record.source}:${record.upc ?? ""}`,
      `${record.brand}:${record.model ?? ""}:${record.title}`,
      `${record.brand}:${record.title}`,
    ]
      .map((key) => key.toLowerCase())
      .filter(Boolean);

    const key = candidateKeys.find((candidate) => candidate.includes(":") && candidate.split(":").some(Boolean)) ?? `${record.source}:${record.id}`;
    if (!seen.has(key)) seen.set(key, record);
  }

  return Array.from(seen.values());
}

export function catalogRecordToSearchable(record: CatalogRecord): SearchableProduct {
  return buildSearchDocument({
    id: record.id,
    source: record.source === "seller" ? "seller" : record.source === "affiliate" ? "affiliate" : record.source === "merchant_feed" ? "imported" : "storefront",
    source_id: record.source_id ?? record.id,
    title: record.title,
    description: record.description,
    brand: record.brand,
    category: record.category,
    subcategory: record.subcategory,
    tags: [...record.tags, record.category, record.brand, record.subcategory],
    seller: record.seller,
    seller_slug: record.seller_slug ?? null,
    product_url: record.product_url ?? record.affiliate_url ?? null,
    image: record.image,
    price: record.price,
    condition: record.condition,
    year: record.release_year ?? record.release_date ? new Date(record.release_date ?? `${record.release_year ?? new Date().getFullYear()}-01-01`).getFullYear() : null,
    release_date: record.release_date ?? null,
    created_at: record.listing_created_at,
    vintage: Boolean(record.vintage),
    collectible: Boolean(record.collectible),
    verified: record.authenticity_status === "verified" || record.authenticity_status === "authentic",
    authenticity_status: record.authenticity_status,
    stock_status: record.in_stock ? "in_stock" : record.availability === "low_stock" ? "low_stock" : "out_of_stock",
    search_keywords: record.search_keywords,
    manufacturer: record.brand,
    model: record.model ?? record.title,
    sku: record.sku ?? null,
    country_of_origin: record.jewelry?.country_of_origin ?? null,
  });
}

export function getCatalogRecords(): CatalogRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(adminCatalogStorageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    return dedupeCatalogRecords((parsed as Partial<CatalogRecord>[]).map((entry) => buildCatalogRecord(entry as Partial<CatalogRecord>)).filter(Boolean));
  } catch {
    return [];
  }
}

export function saveCatalogRecords(records: CatalogRecord[]) {
  if (typeof window === "undefined") return records;
  const deduped = dedupeCatalogRecords(records);
  window.localStorage.setItem(adminCatalogStorageKey, JSON.stringify(deduped));
  return deduped;
}

export function upsertCatalogRecord(record: CatalogRecord) {
  const next = dedupeCatalogRecords([...getCatalogRecords(), record]);
  return saveCatalogRecords(next);
}

export function parseCatalogImport(rawInput: string, format: "json" | "csv") {
  if (format === "json") {
    const parsed = JSON.parse(rawInput) as unknown;
    const rows = Array.isArray(parsed) ? parsed : [parsed];
    return rows
      .map((entry) => buildCatalogRecord(entry as Partial<CatalogRecord>))
      .filter((record) => Boolean(record.title));
  }

  const lines = rawInput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((header) => header.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((value) => value.trim().replace(/^"|"$/g, ""));
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    const record = buildCatalogRecord({
      id: row.id || undefined,
      title: row.title || "Imported catalog item",
      description: row.description || "Imported catalog listing.",
      category: row.category || "Electronics",
      subcategory: row.subcategory || "",
      brand: row.brand || "Unbranded",
      source: (row.source as CatalogSource) || "merchant_feed",
      source_id: normalizeOptionalString(row.source_id),
      price: Number(row.price || 0),
      condition: row.condition || "New",
      seller: row.seller || "Imported seller",
      image: row.image || undefined,
      affiliate_url: row.affiliate_url || undefined,
      product_url: row.product_url || undefined,
      active: row.active !== "false",
      featured: row.featured === "true",
      availability: (row.availability as CatalogAvailability) || "unknown",
      in_stock: row.in_stock === "true",
      tags: normalizeStringArray(row.tags ? row.tags.split("|") : []),
      search_keywords: normalizeStringArray(row.search_keywords ? row.search_keywords.split("|") : []),
      authenticity_status: row.authenticity_status || "not_required",
      release_year: Number(row.release_year || 0) || undefined,
      vintage: row.vintage === "true",
      collectible: row.collectible === "true",
      status: row.status === "inactive" ? "inactive" : "active",
    });

    return record;
  });
}

export function findDuplicateCatalogRecords(records: CatalogRecord[]) {
  const indexes = new Map<string, CatalogRecord[]>();

  for (const record of records) {
    const keys = [
      record.source && record.source_id ? `source:${record.source}:${record.source_id}` : null,
      record.sku ? `sku:${record.sku}` : null,
      record.upc ? `upc:${record.upc}` : null,
      record.brand && record.model ? `brand-model:${record.brand}:${record.model}` : null,
      record.brand && record.title ? `brand-title:${record.brand}:${record.title}` : null,
    ].filter(Boolean) as string[];

    for (const key of keys) {
      const bucket = indexes.get(key) ?? [];
      bucket.push(record);
      indexes.set(key, bucket);
    }
  }

  return Array.from(indexes.entries())
    .filter(([, bucket]) => bucket.length > 1)
    .map(([key, bucket]) => ({ key, records: bucket }));
}

export function getCatalogSearchDocuments() {
  return getCatalogRecords().map((record) => catalogRecordToSearchable(record));
}
