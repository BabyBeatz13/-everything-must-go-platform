import { products as storefrontProducts } from "@/data/products";
import { getDevelopmentCatalogDocuments, isDevelopmentCatalogEnabled } from "@/lib/test-catalog";
import { buildSearchDocument, searchMarketplaceItems, type SearchableProduct } from "./search";
import { resolveProductImage } from "./product-images";
import { supabaseMarketplace, isMarketplaceSupabaseConfigured } from "./supabase-marketplace";

export type MarketplaceProductStatus = "draft" | "active" | "paused" | "archived";

export type MarketplaceProductRecord = {
  id: string;
  seller_id: string | null;
  title: string;
  description: string | null;
  category: string | null;
  subcategory: string | null;
  brand: string | null;
  price: number;
  compare_at_price: number | null;
  inventory_quantity: number;
  sku: string | null;
  condition: string | null;
  shipping_price: number;
  free_shipping: boolean;
  product_images: string[] | null;
  image_gallery?: unknown;
  image_primary_index?: number | null;
  primary_image_url?: string | null;
  model?: string | null;
  year_era?: string | null;
  tags?: string[] | null;
  availability?: string | null;
  source_type?: "seller" | "affiliate" | "admin_curated" | "merchant_feed" | "development_seed" | null;
  external_product_id?: string | null;
  source_updated_at?: string | null;
  featured: boolean;
  status: MarketplaceProductStatus;
  created_at: string;
  updated_at: string;
  seller_name?: string;
};

export type MarketplaceProductCardView = {
  id: string;
  title: string;
  image: string;
  category: string;
  subcategory?: string;
  storeName: string;
  price: number;
  condition: string;
  inventory: number;
  freeShipping: boolean;
  featured: boolean;
  rating: number;
  description: string;
  inStock: boolean;
  brand: string;
  sellerId: string | null;
  shippingPrice: number;
  status: MarketplaceProductStatus;
  sourceType?: "seller" | "affiliate" | "admin_curated" | "merchant_feed" | "development_seed";
  sourceRecordType?: "real_seller" | "approved_external" | "hardcoded" | "demo" | "fallback";
  purchaseUrl?: string | null;
  externalProductId?: string | null;
  sourceUpdatedAt?: string | null;
  listingCreatedAt?: string;
  imageSource?: "seller_upload" | "approved_affiliate_source" | "merchant_feed" | "admin_curated" | "development_seed" | "placeholder";
  imageGallery?: string[];
  authenticityStatus?: string;
  availability?: string;
  model?: string;
  yearEra?: string;
  tags?: string[];
  year?: number | null;
  metal?: string;
  karat?: string;
  weight?: string;
  chainLength?: string;
  chainWidth?: string;
  stone?: string;
  diamondType?: string;
  caratWeight?: string;
  certification?: string;
  is_test_data?: boolean;
};

export type MarketplaceQueryFilters = {
  search?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  seller?: string;
  inStock?: boolean;
  freeShipping?: boolean;
  sort?: "relevance" | "newest" | "oldest" | "price_asc" | "price_desc";
};

const FALLBACK_PRODUCT_IDS = new Set(["seller-product-1", "seller-product-2", "seller-product-3"]);

function isFallbackProductId(id: string | null | undefined) {
  if (!id) return false;
  return FALLBACK_PRODUCT_IDS.has(String(id));
}

function parseGalleryImages(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry || "").trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.map((entry) => String(entry || "").trim()).filter(Boolean);
      return [];
    } catch {
      return [];
    }
  }

  return [];
}

function storefrontCreatedAtFromId(id: string): string {
  const match = id.match(/(\d+)$/);
  const index = match ? Number(match[1]) : 0;
  const day = Number.isFinite(index) && index > 0 ? index : 1;
  const date = new Date(Date.UTC(2026, 0, Math.min(day, 28)));
  return date.toISOString();
}

function shouldIncludeInCustomerInventory(document: SearchableProduct, includeNonProductionInventory: boolean) {
  if (isFallbackProductId(document.id)) return false;
  if (document.is_test_data) return false;

  const sourceType = String(document.source_type ?? "").toLowerCase();
  if (!includeNonProductionInventory && (sourceType === "development_seed" || sourceType === "admin_curated")) {
    return false;
  }

  return true;
}

function normalizeMarketplaceProduct(row: Partial<MarketplaceProductRecord> | null | undefined): MarketplaceProductCardView | null {
  if (!row) return null;

  if (isFallbackProductId(String(row.id ?? ""))) {
    return null;
  }

  const galleryFromImages = Array.isArray(row.product_images) ? row.product_images.filter(Boolean) : [];
  const galleryFromJson = parseGalleryImages(row.image_gallery);
  const mergedGallery = (galleryFromJson.length > 0 ? galleryFromJson : galleryFromImages)
    .map((entry) => String(entry || "").trim())
    .filter(Boolean);
  const primaryIndex = Math.max(0, Number(row.image_primary_index ?? 0));
  const primaryFromGallery = mergedGallery[primaryIndex] || mergedGallery[0] || "";
  const primaryImage = String(row.primary_image_url ?? "").trim() || primaryFromGallery;
  const productTags = Array.isArray(row.tags) ? row.tags.map((entry) => String(entry || "").trim()).filter(Boolean) : [];

  const canonicalImage = resolveProductImage({
    id: row.id,
    title: row.title,
    category: row.category,
    brand: row.brand,
    image: primaryImage || undefined,
    primary_image_url: primaryImage || undefined,
    gallery_images: mergedGallery,
    imageSource: "seller_upload",
  });

  return {
    id: String(row.id ?? "unknown"),
    title: row.title ?? "Marketplace product",
    image: canonicalImage.primary_image_url,
    category: row.category ?? "Electronics",
    subcategory: row.subcategory ?? undefined,
    storeName: row.seller_name ?? "Seller store",
    price: Number(row.price ?? 0),
    condition: row.condition ? row.condition.charAt(0).toUpperCase() + row.condition.slice(1) : "New",
    inventory: Number(row.inventory_quantity ?? 0),
    freeShipping: Boolean(row.free_shipping),
    featured: Boolean(row.featured),
    rating: 0,
    description: row.description ?? "Curated seller listing from the marketplace.",
    inStock: Number(row.inventory_quantity ?? 0) > 0,
    brand: row.brand ?? "Seller brand",
    sellerId: row.seller_id ?? null,
    shippingPrice: Boolean(row.free_shipping) ? 0 : Number(row.shipping_price ?? 0),
    status: (row.status ?? "draft") as MarketplaceProductStatus,
    sourceType: "seller",
    sourceRecordType: "real_seller",
    purchaseUrl: null,
    externalProductId: row.external_product_id ?? null,
    sourceUpdatedAt: row.source_updated_at ?? row.updated_at ?? null,
    listingCreatedAt: row.created_at,
    imageSource: canonicalImage.image_source,
    imageGallery: canonicalImage.gallery_images,
    authenticityStatus: "verified",
    availability: row.availability ?? (Number(row.inventory_quantity ?? 0) > 0 ? "in_stock" : "out_of_stock"),
    model: row.model ?? undefined,
    yearEra: row.year_era ?? undefined,
    tags: productTags,
  };
}

function normalizeStorefrontProduct(product: (typeof storefrontProducts)[number]): MarketplaceProductCardView {
  const imageMetadata = resolveProductImage({
    id: product.id,
    title: product.name,
    category: product.category,
    brand: product.brand,
    image: product.image,
    imageSource: product.imageSource,
  });

  return {
    id: product.id,
    title: product.name,
    image: imageMetadata.primary_image_url,
    category: product.category,
    subcategory: product.subcategory,
    storeName: product.merchant,
    price: product.price,
    condition: "New",
    inventory: product.inStock ? 1 : 0,
    freeShipping: false,
    featured: product.featured,
    rating: 0,
    description: product.description,
    inStock: product.inStock,
    brand: product.brand,
    sellerId: null,
    shippingPrice: 0,
    status: "active",
    sourceType: product.sourceType ?? "affiliate",
    sourceRecordType: product.sourceType === "affiliate" ? "approved_external" : "hardcoded",
    purchaseUrl: product.affiliateUrl,
    externalProductId: product.externalProductId ?? product.id,
    sourceUpdatedAt: product.sourceUpdatedAt ?? storefrontCreatedAtFromId(product.id),
    listingCreatedAt: product.listingCreatedAt ?? storefrontCreatedAtFromId(product.id),
    imageSource: product.imageSource,
    imageGallery: imageMetadata.gallery_images,
    authenticityStatus: product.authenticityStatus ?? "not_required",
    availability: product.inStock ? "in_stock" : "out_of_stock",
    model: product.model,
    yearEra: product.yearEra,
    tags: product.tags ?? [],
    year: product.year ?? null,
    metal: product.metal,
    karat: product.karat,
    weight: product.weight,
    chainLength: product.chainLength,
    chainWidth: product.chainWidth,
    stone: product.stone,
    diamondType: product.diamondType,
    caratWeight: product.caratWeight,
    certification: product.certification,
  };
}

function storefrontProductToSearchDocument(product: (typeof storefrontProducts)[number]): SearchableProduct {
  const imageMetadata = resolveProductImage({
    id: product.id,
    name: product.name,
    title: product.name,
    category: product.category,
    brand: product.brand,
    image: product.image,
    imageSource: product.imageSource,
  });

  return buildSearchDocument({
    id: product.id,
    source: product.sourceType === "affiliate" ? "affiliate" : product.sourceType === "merchant_feed" ? "imported" : product.sourceType === "seller" ? "seller" : "storefront",
    source_type: product.sourceType ?? "affiliate",
    source_id: product.id,
    title: product.name,
    description: product.description,
    brand: product.brand,
    category: product.category,
    subcategory: product.subcategory ?? "",
    tags: [product.category, product.subcategory ?? "", product.brand, product.merchant, ...(product.tags ?? [])],
    seller: product.merchant,
    seller_slug: null,
    product_url: `/product/${product.id}`,
    image: imageMetadata.primary_image_url,
    image_source: imageMetadata.image_source,
    purchase_url: product.affiliateUrl,
    price: product.price,
    rating: product.rating,
    condition: "New",
    year: product.year ?? null,
    year_label: product.year ? String(product.year) : null,
    release_date: null,
    created_at: product.listingCreatedAt ?? storefrontCreatedAtFromId(product.id),
    vintage: product.category === "Vintage Gaming" || product.tags?.includes("vintage") || false,
    collectible: product.category === "Collectibles" || product.tags?.includes("collectible") || false,
    verified: product.authenticityStatus === "verified" || product.authenticityStatus === "authentic",
    authenticity_status: product.authenticityStatus ?? "not_required",
    stock_status: product.inStock ? "in_stock" : "out_of_stock",
    search_keywords: [
      product.name,
      product.brand,
      product.category,
      product.subcategory ?? "",
      product.merchant,
      ...(product.tags ?? []),
      ...(product.searchKeywords ?? []),
      product.metal ?? "",
      product.karat ?? "",
      product.stone ?? "",
      product.diamondType ?? "",
      product.caratWeight ?? "",
      product.chainLength ?? "",
      product.chainWidth ?? "",
      product.certification ?? "",
    ],
    manufacturer: product.brand,
    model: product.model ?? product.name,
    country_of_origin: null,
    metal: product.metal,
    karat: product.karat,
    weight: product.weight,
    chain_length: product.chainLength,
    chain_width: product.chainWidth,
    stone: product.stone,
    diamond_type: product.diamondType,
    carat_weight: product.caratWeight,
    certification: product.certification,
    is_test_data: Boolean(product.isTestData),
  });
}

function dedupeMarketplaceProducts(products: MarketplaceProductCardView[]): MarketplaceProductCardView[] {
  const seen = new Map<string, MarketplaceProductCardView>();

  for (const product of products) {
    const dedupeKey = `${product.title.toLowerCase().trim()}|${product.storeName.toLowerCase().trim()}|${product.category.toLowerCase().trim()}|${product.brand.toLowerCase().trim()}`;
    if (!seen.has(dedupeKey)) {
      seen.set(dedupeKey, product);
    }
  }

  return Array.from(seen.values());
}

function productDocumentToCard(document: SearchableProduct): MarketplaceProductCardView {
  const imageMetadata = resolveProductImage({
    id: document.id,
    name: document.title,
    title: document.title,
    category: document.category,
    brand: document.brand,
    image: document.image,
    imageSource: document.image_source,
  });

  return {
    id: document.id,
    title: document.title,
    image: imageMetadata.primary_image_url,
    category: document.category,
    subcategory: document.subcategory || undefined,
    storeName: document.seller,
    price: document.price,
    condition: document.condition,
    inventory: document.stock_status === "in_stock" ? 1 : 0,
    freeShipping: false,
    featured: document.verified,
    rating: typeof document.rating === "number" ? document.rating : 0,
    description: document.description,
    inStock: document.stock_status === "in_stock",
    brand: document.brand,
    sellerId: document.source_id ?? null,
    shippingPrice: 0,
    status: "active",
    sourceType: document.source_type,
    sourceRecordType: document.source_type === "seller"
      ? "real_seller"
      : document.is_test_data
        ? "demo"
        : document.source_type === "affiliate" || document.source_type === "merchant_feed"
          ? "approved_external"
          : "hardcoded",
    purchaseUrl: document.purchase_url ?? document.product_url,
    externalProductId: document.source_id,
    sourceUpdatedAt: null,
    listingCreatedAt: document.created_at,
    imageSource: imageMetadata.image_source,
    imageGallery: imageMetadata.gallery_images,
    authenticityStatus: document.authenticity_status,
    availability: document.stock_status,
    model: document.model ?? undefined,
    yearEra: document.year_label ?? undefined,
    tags: document.tags,
    year: document.year,
    metal: document.metal ?? undefined,
    karat: document.karat ?? undefined,
    weight: document.weight ?? undefined,
    chainLength: document.chain_length ?? undefined,
    chainWidth: document.chain_width ?? undefined,
    stone: document.stone ?? undefined,
    diamondType: document.diamond_type ?? undefined,
    caratWeight: document.carat_weight ?? undefined,
    certification: document.certification ?? undefined,
    is_test_data: Boolean(document.is_test_data),
  };
}

function normalizeSearchText(value: string | null | undefined): string {
  return String(value ?? "").trim().toLowerCase();
}

function singularizeToken(token: string) {
  if (token.length <= 3) return token;
  if (token.endsWith("ies") && token.length > 4) return `${token.slice(0, -3)}y`;
  if (token.endsWith("sses")) return token.slice(0, -2);
  if (token.endsWith("s") && !token.endsWith("ss")) return token.slice(0, -1);
  return token;
}

function productMatchesSearch(product: MarketplaceProductCardView, query: string): boolean {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  const queryTokens = normalizedQuery
    .split(/\s+/)
    .map((token) => singularizeToken(token))
    .filter(Boolean);

  if (queryTokens.length === 0) return true;

  const searchText = [
    product.title,
    product.description,
    product.category,
    product.brand,
    product.storeName,
    product.condition,
    product.status,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const singularizedText = searchText
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map((token) => singularizeToken(token))
    .join(" ");

  return queryTokens.every((token) => singularizedText.includes(token));
}

async function getSellerNameById(sellerId: string | null) {
  if (!sellerId || !isMarketplaceSupabaseConfigured()) {
    return "Seller store";
  }

  const { data } = await supabaseMarketplace
    .from("seller_profiles")
    .select("store_name")
    .eq("id", sellerId)
    .maybeSingle();

  return data?.store_name ?? "Seller store";
}

export async function getMarketplaceProducts(filters: MarketplaceQueryFilters = {}): Promise<MarketplaceProductCardView[]> {
  const trimmedSearch = filters.search?.trim() ?? "";
  const storefrontDocs = storefrontProducts.map((product) => storefrontProductToSearchDocument(product));
  const canQuerySupabase = isMarketplaceSupabaseConfigured() && typeof window === "undefined";
  const includeNonProductionInventory = isDevelopmentCatalogEnabled();

  let sellerDocs: SearchableProduct[] = [];
  if (canQuerySupabase) {
    try {
      const { data, error } = await supabaseMarketplace
        .from("marketplace_products")
        .select("*")
        .eq("status", "active");

      if (!error && data) {
        sellerDocs = await Promise.all(
          (data as Array<Record<string, any>>).map(async (row) => {
            const sellerName = await getSellerNameById(String(row.seller_id ?? ""));
            const normalized = normalizeMarketplaceProduct({ ...row, seller_name: sellerName });
            if (!normalized) return null;

            return buildSearchDocument({
              id: normalized.id,
              source: "seller",
              source_type: "seller",
              source_id: normalized.sellerId ?? normalized.id,
              title: normalized.title,
              description: normalized.description,
              brand: normalized.brand,
              category: normalized.category,
              subcategory: normalized.subcategory ?? "",
              tags: [normalized.category, normalized.subcategory ?? "", normalized.brand, normalized.storeName, ...(normalized.tags ?? [])],
              seller: normalized.storeName,
              seller_slug: null,
              product_url: `/product/${normalized.id}`,
              image: normalized.image,
              image_source: normalized.imageSource,
              purchase_url: normalized.purchaseUrl ?? null,
              price: normalized.price,
              rating: normalized.rating,
              condition: normalized.condition,
              year: normalized.year ?? null,
              release_date: null,
              created_at: normalized.listingCreatedAt ?? new Date().toISOString(),
              vintage: normalized.condition.toLowerCase() === "vintage" || Boolean(normalized.tags?.some((tag) => String(tag).toLowerCase().includes("vintage"))),
              collectible: normalized.condition.toLowerCase() === "collectible" || normalized.category.toLowerCase().includes("collectible"),
              verified: true,
              authenticity_status: "verified",
              stock_status: normalized.inStock ? "in_stock" : "out_of_stock",
              search_keywords: [normalized.title, normalized.brand, normalized.category, normalized.subcategory ?? "", normalized.storeName, normalized.model ?? "", normalized.yearEra ?? "", ...(normalized.tags ?? [])],
              manufacturer: normalized.brand,
              model: normalized.model ?? normalized.title,
              year_label: normalized.yearEra ?? null,
              country_of_origin: null,
            });
          }),
        ).then((items) => items.filter((item): item is SearchableProduct => Boolean(item)));
      }
    } catch {
      sellerDocs = [];
    }
  }

  const developmentDocs = includeNonProductionInventory ? getDevelopmentCatalogDocuments() : [];
  const mergedDocs = Array.from(
    new Map(
      [...storefrontDocs, ...sellerDocs, ...developmentDocs].map((document) => [`${document.source}:${document.id}`, document]),
    ).values(),
  );

  const customerSafeDocs = mergedDocs.filter((document) => shouldIncludeInCustomerInventory(document, includeNonProductionInventory));

  const filtered = searchMarketplaceItems(customerSafeDocs, {
    search: trimmedSearch,
    category: filters.category,
    subcategory: filters.subcategory,
    brand: filters.brand,
    seller: filters.seller,
    condition: filters.condition,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    inStock: filters.inStock,
    freeShipping: filters.freeShipping,
    sort: filters.sort ?? "relevance",
  });

  return filtered.map((document) => productDocumentToCard(document));
}

export async function getMarketplaceProductById(productId: string): Promise<MarketplaceProductCardView | null> {
  if (isFallbackProductId(productId)) {
    return null;
  }

  const storefrontMatch = storefrontProducts.find((product) => product.id === productId);
  if (storefrontMatch) {
    const normalized = normalizeStorefrontProduct(storefrontMatch);
    return {
      ...normalized,
      image: resolveProductImage({
        id: normalized.id,
        title: normalized.title,
        category: normalized.category,
        brand: normalized.brand,
        image: normalized.image,
        imageSource: normalized.imageSource,
      }).primary_image_url,
    };
  }

  if (!isMarketplaceSupabaseConfigured()) {
    return null;
  }

  const { data, error } = await supabaseMarketplace
    .from("marketplace_products")
    .select("*")
    .eq("id", productId)
    .eq("status", "active")
    .maybeSingle();

  if (error || !data) return null;

  const sellerName = await getSellerNameById(data.seller_id);
  const normalized = normalizeMarketplaceProduct({ ...data, seller_name: sellerName });
  if (!normalized) return null;
  if (normalized.is_test_data) return null;
  return normalized;
}

export async function getSellerProducts(sellerId: string): Promise<MarketplaceProductRecord[]> {
  if (!isMarketplaceSupabaseConfigured()) {
    return [];
  }

  const { data, error } = await supabaseMarketplace
    .from("marketplace_products")
    .select("*")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function createSellerProduct(product: Partial<MarketplaceProductRecord>) {
  if (!isMarketplaceSupabaseConfigured()) {
    return { data: { id: "demo-product-id" }, error: null };
  }

  const { data, error } = await supabaseMarketplace.from("marketplace_products").insert(product).select().single();
  return { data, error };
}

export async function updateSellerProduct(productId: string, updates: Partial<MarketplaceProductRecord>) {
  if (!isMarketplaceSupabaseConfigured()) {
    return { data: { id: productId }, error: null };
  }

  const { data, error } = await supabaseMarketplace
    .from("marketplace_products")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", productId)
    .select()
    .single();

  return { data, error };
}

export async function deleteSellerProduct(productId: string) {
  if (!isMarketplaceSupabaseConfigured()) {
    return { error: null };
  }

  const { error } = await supabaseMarketplace.from("marketplace_products").delete().eq("id", productId);
  return { error };
}

export function buildProductUploadPath(sellerId: string, productId: string, fileName: string) {
  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
  return `sellers/${sellerId}/products/${productId}/${safeFileName}`;
}

export async function uploadProductImages(sellerId: string, productId: string, files: File[]) {
  if (!isMarketplaceSupabaseConfigured()) {
    return { urls: files.map((file) => URL.createObjectURL(file)), error: null };
  }

  const bucket = "product-images";
  const uploadedUrls: string[] = [];

  for (const file of files) {
    const path = buildProductUploadPath(sellerId, productId, file.name);
    const { error } = await supabaseMarketplace.storage.from(bucket).upload(path, file, {
      upsert: true,
      contentType: file.type || "image/jpeg",
    });

    if (error) {
      return { urls: uploadedUrls, error };
    }

    const { data } = supabaseMarketplace.storage.from(bucket).getPublicUrl(path);
    uploadedUrls.push(data.publicUrl);
  }

  return { urls: uploadedUrls, error: null };
}
