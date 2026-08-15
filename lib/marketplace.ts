import { products as storefrontProducts } from "@/data/products";
import { buildSearchDocument, searchMarketplaceItems, type SearchableProduct } from "./search";
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
  sort?: "newest" | "price_asc" | "price_desc";
};

const fallbackProducts: MarketplaceProductCardView[] = [
  {
    id: "seller-product-1",
    title: "Brass Floor Lamp",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    category: "Home & Furniture",
    storeName: "Velvet & Vine",
    price: 289,
    condition: "New",
    inventory: 10,
    freeShipping: false,
    featured: true,
    rating: 4.9,
    description: "Warm ambient lamp with premium brass finish and linen shade.",
    inStock: true,
    brand: "Velvet & Vine",
    sellerId: "demo-seller-1",
    shippingPrice: 18,
    status: "active",
  },
  {
    id: "seller-product-2",
    title: "Vintage Mirror Set",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
    category: "Home Decor",
    storeName: "Velvet & Vine",
    price: 420,
    condition: "Vintage",
    inventory: 5,
    freeShipping: true,
    featured: false,
    rating: 4.8,
    description: "Hand-finished vintage mirror pair for gallery-style interiors.",
    inStock: true,
    brand: "Velvet & Vine",
    sellerId: "demo-seller-1",
    shippingPrice: 0,
    status: "active",
  },
  {
    id: "seller-product-3",
    title: "Collectible Wrestling Figure",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
    category: "Wrestling Figures",
    storeName: "Collector Vault",
    price: 180,
    condition: "Collectible",
    inventory: 3,
    freeShipping: true,
    featured: true,
    rating: 4.7,
    description: "Premium display piece with limited edition finish.",
    inStock: true,
    brand: "Collector Vault",
    sellerId: "demo-seller-2",
    shippingPrice: 0,
    status: "active",
  },
];

function normalizeMarketplaceProduct(row: Partial<MarketplaceProductRecord> | null | undefined): MarketplaceProductCardView | null {
  if (!row) return null;

  const image = Array.isArray(row.product_images) && row.product_images.length > 0 ? row.product_images[0] : "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80";

  return {
    id: String(row.id ?? "unknown"),
    title: row.title ?? "Marketplace product",
    image,
    category: row.category ?? "Electronics",
    storeName: row.seller_name ?? "Seller store",
    price: Number(row.price ?? 0),
    condition: row.condition ? row.condition.charAt(0).toUpperCase() + row.condition.slice(1) : "New",
    inventory: Number(row.inventory_quantity ?? 0),
    freeShipping: Boolean(row.free_shipping),
    featured: Boolean(row.featured),
    rating: 4.8,
    description: row.description ?? "Curated seller listing from the marketplace.",
    inStock: Number(row.inventory_quantity ?? 0) > 0,
    brand: row.brand ?? "Seller brand",
    sellerId: row.seller_id ?? null,
    shippingPrice: Boolean(row.free_shipping) ? 0 : Number(row.shipping_price ?? 0),
    status: (row.status ?? "draft") as MarketplaceProductStatus,
  };
}

function normalizeStorefrontProduct(product: (typeof storefrontProducts)[number]): MarketplaceProductCardView {
  return {
    id: product.id,
    title: product.name,
    image: product.image,
    category: product.category,
    storeName: product.merchant,
    price: product.price,
    condition: "New",
    inventory: product.inStock ? 1 : 0,
    freeShipping: false,
    featured: product.featured,
    rating: product.rating,
    description: product.description,
    inStock: product.inStock,
    brand: product.brand,
    sellerId: null,
    shippingPrice: 0,
    status: "active",
  };
}

function storefrontProductToSearchDocument(product: (typeof storefrontProducts)[number]): SearchableProduct {
  return buildSearchDocument({
    id: product.id,
    source: "storefront",
    source_id: product.id,
    title: product.name,
    description: product.description,
    brand: product.brand,
    category: product.category,
    subcategory: "",
    tags: [product.category, product.brand, product.merchant],
    seller: product.merchant,
    seller_slug: null,
    product_url: `/product/${product.id}`,
    image: product.image,
    price: product.price,
    condition: "New",
    year: null,
    release_date: null,
    created_at: new Date().toISOString(),
    vintage: false,
    collectible: false,
    verified: true,
    authenticity_status: "not_required",
    stock_status: product.inStock ? "in_stock" : "out_of_stock",
    search_keywords: [product.name, product.brand, product.category, product.merchant],
    manufacturer: product.brand,
    model: product.name,
    country_of_origin: null,
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
  return {
    id: document.id,
    title: document.title,
    image: document.image,
    category: document.category,
    storeName: document.seller,
    price: document.price,
    condition: document.condition,
    inventory: document.stock_status === "in_stock" ? 1 : 0,
    freeShipping: false,
    featured: document.verified,
    rating: 4.8,
    description: document.description,
    inStock: document.stock_status === "in_stock",
    brand: document.brand,
    sellerId: document.source_id ?? null,
    shippingPrice: 0,
    status: "active",
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

  let sellerDocs: SearchableProduct[] = [];
  if (isMarketplaceSupabaseConfigured()) {
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
            source_id: normalized.sellerId ?? normalized.id,
            title: normalized.title,
            description: normalized.description,
            brand: normalized.brand,
            category: normalized.category,
            subcategory: "",
            tags: [normalized.category, normalized.brand, normalized.storeName],
            seller: normalized.storeName,
            seller_slug: null,
            product_url: `/product/${normalized.id}`,
            image: normalized.image,
            price: normalized.price,
            condition: normalized.condition,
            year: null,
            release_date: null,
            created_at: new Date().toISOString(),
            vintage: false,
            collectible: false,
            verified: true,
            authenticity_status: "verified",
            stock_status: normalized.inStock ? "in_stock" : "out_of_stock",
            search_keywords: [normalized.title, normalized.brand, normalized.category, normalized.storeName],
            manufacturer: normalized.brand,
            model: normalized.title,
            country_of_origin: null,
          });
        }),
      ).then((items) => items.filter((item): item is SearchableProduct => Boolean(item)));
    }
  }

  const mergedDocs = Array.from(
    new Map(
      [...storefrontDocs, ...sellerDocs].map((document) => [`${document.source}:${document.id}`, document]),
    ).values(),
  );

  const filtered = searchMarketplaceItems(mergedDocs, {
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
  if (!isMarketplaceSupabaseConfigured()) {
    return fallbackProducts.find((product) => product.id === productId) ?? null;
  }

  const { data, error } = await supabaseMarketplace
    .from("marketplace_products")
    .select("*")
    .eq("id", productId)
    .eq("status", "active")
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const sellerName = await getSellerNameById(data.seller_id);
  return normalizeMarketplaceProduct({ ...data, seller_name: sellerName });
}

export async function getSellerProducts(sellerId: string): Promise<MarketplaceProductRecord[]> {
  if (!isMarketplaceSupabaseConfigured()) {
    return [
      {
        id: "seller-product-1",
        seller_id: sellerId,
        title: "Brass Floor Lamp",
        description: "Warm ambient lamp with premium brass finish and linen shade.",
        category: "Home & Furniture",
        subcategory: "Lamps",
        brand: "Velvet & Vine",
        price: 289,
        compare_at_price: 349,
        inventory_quantity: 10,
        sku: "VVM-LAMP-001",
        condition: "new",
        shipping_price: 18,
        free_shipping: false,
        product_images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"],
        featured: true,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        seller_name: "Velvet & Vine",
      },
    ];
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
