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
  };
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
  if (!isMarketplaceSupabaseConfigured()) {
    return fallbackProducts.filter((product) => {
      if (filters.category && product.category !== filters.category) return false;
      if (filters.search && !product.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.condition && product.condition !== filters.condition) return false;
      if (filters.inStock && !product.inStock) return false;
      if (filters.freeShipping && !product.freeShipping) return false;
      if (typeof filters.minPrice === "number" && product.price < filters.minPrice) return false;
      if (typeof filters.maxPrice === "number" && product.price > filters.maxPrice) return false;
      return true;
    });
  }

  let query = supabaseMarketplace.from("marketplace_products").select("*").eq("status", "active");

  if (filters.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  if (filters.subcategory) {
    query = query.eq("subcategory", filters.subcategory);
  }

  if (filters.brand) {
    query = query.ilike("brand", `%${filters.brand}%`);
  }

  if (typeof filters.minPrice === "number") {
    query = query.gte("price", filters.minPrice);
  }

  if (typeof filters.maxPrice === "number") {
    query = query.lte("price", filters.maxPrice);
  }

  if (filters.condition) {
    query = query.eq("condition", filters.condition.toLowerCase());
  }

  if (filters.inStock) {
    query = query.gt("inventory_quantity", 0);
  }

  if (filters.freeShipping) {
    query = query.eq("free_shipping", true);
  }

  if (filters.seller) {
    query = query.eq("seller_id", filters.seller);
  }

  if (filters.sort === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (filters.sort === "price_desc") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error || !data) {
    return fallbackProducts;
  }

  const products = await Promise.all(
    (data as Array<Record<string, any>>).map(async (row: Record<string, any>) => {
      const sellerName = await getSellerNameById(String(row.seller_id ?? ""));
      return normalizeMarketplaceProduct({ ...row, seller_name: sellerName });
    }),
  );

  return products.filter((product): product is MarketplaceProductCardView => Boolean(product));
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
