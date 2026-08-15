export type ProductImageSource =
  | "seller_upload"
  | "approved_affiliate_source"
  | "merchant_feed"
  | "admin_curated"
  | "development_seed"
  | "placeholder";

export type ProductImageMetadata = {
  primary_image_url: string;
  gallery_images: string[];
  image_source: ProductImageSource;
  image_alt: string;
  source_product_id: string | null;
  image_verified: boolean;
  image_last_checked: string | null;
};

const PRODUCT_IMAGE_UNAVAILABLE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#171717" />
        <stop offset="100%" stop-color="#090909" />
      </linearGradient>
    </defs>
    <rect width="1200" height="900" fill="url(#bg)" />
    <rect x="80" y="80" width="1040" height="740" rx="28" fill="none" stroke="#f4c661" stroke-width="4" opacity="0.75" />
    <text x="600" y="420" text-anchor="middle" font-size="48" fill="#f4c661" font-family="Arial, sans-serif" font-weight="700">Image unavailable</text>
    <text x="600" y="494" text-anchor="middle" font-size="26" fill="#d4d4d8" font-family="Arial, sans-serif">Exact product imagery not available</text>
  </svg>
`)}`;

const PRODUCT_IMAGE_LIBRARY: Record<string, ProductImageMetadata> = {
  "airpods max": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Apple AirPods Max over-ear headphones",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "iphone 15 pro": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Apple iPhone 15 Pro smartphone",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "iphone 16 pro max": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Apple iPhone 16 Pro Max smartphone",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "macbook air m4": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Apple MacBook Air M4 laptop",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "samsung galaxy s25 ultra": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Samsung Galaxy S25 Ultra smartphone",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "luxury accent chair": {
    primary_image_url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    ],
    image_source: "admin_curated",
    image_alt: "Luxury accent chair in a premium home setting",
    source_product_id: null,
    image_verified: true,
    image_last_checked: new Date().toISOString(),
  },
  "california king bed frame": {
    primary_image_url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    ],
    image_source: "admin_curated",
    image_alt: "California king bed frame",
    source_product_id: null,
    image_verified: true,
    image_last_checked: new Date().toISOString(),
  },
  "modern marble console": {
    primary_image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
    gallery_images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    ],
    image_source: "admin_curated",
    image_alt: "Modern marble console table",
    source_product_id: null,
    image_verified: true,
    image_last_checked: new Date().toISOString(),
  },
};

function normalizeProductKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

export function resolveProductImage(product: {
  id?: string | number | null;
  name?: string | null;
  title?: string | null;
  category?: string | null;
  brand?: string | null;
  image?: string | null;
  imageSource?: ProductImageSource | null;
  primary_image_url?: string | null;
  gallery_images?: string[] | null;
}): ProductImageMetadata {
  const productName = (product.name ?? product.title ?? "").trim();
  const imageKey = normalizeProductKey(productName);

  if (imageKey && PRODUCT_IMAGE_LIBRARY[imageKey]) {
    return {
      ...PRODUCT_IMAGE_LIBRARY[imageKey],
      source_product_id: product.id ? String(product.id) : null,
      image_last_checked: new Date().toISOString(),
    };
  }

  const primaryImage = product.primary_image_url || product.image || "";
  if (primaryImage.trim()) {
    const gallery = Array.isArray(product.gallery_images) && product.gallery_images.length > 0 ? product.gallery_images.filter(Boolean) : [primaryImage];
    return {
      primary_image_url: primaryImage,
      gallery_images: gallery,
      image_source: product.imageSource ?? "merchant_feed",
      image_alt: productName ? `${productName}` : `${product.brand ?? product.category ?? "Product"} listing`,
      source_product_id: product.id ? String(product.id) : null,
      image_verified: true,
      image_last_checked: new Date().toISOString(),
    };
  }

  const fallbackTitle = productName || `${product.brand ?? "Product"} ${product.category ?? "listing"}`;
  return {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: `${fallbackTitle} image unavailable`,
    source_product_id: product.id ? String(product.id) : null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  };
}

export function normalizeImageUrl(image: string | null | undefined): string {
  return image && /^https?:\/\//i.test(image) ? image : PRODUCT_IMAGE_UNAVAILABLE;
}
