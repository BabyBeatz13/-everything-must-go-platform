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
  "iphone 16 pro max 256gb": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Apple iPhone 16 Pro Max smartphone",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "macbook air m4 13 inch": {
    primary_image_url: "https://www.apple.com/v/macbook-air/z/images/meta/macbook_air_mx__ez5y0k5yy7au_og.png?202608111253",
    gallery_images: [
      "https://www.apple.com/v/macbook-air/z/images/meta/macbook_air_mx__ez5y0k5yy7au_og.png?202608111253",
    ],
    image_source: "approved_affiliate_source",
    image_alt: "Apple MacBook Air M4 13-inch",
    source_product_id: null,
    image_verified: true,
    image_last_checked: new Date().toISOString(),
  },
  "airpods max sky blue": {
    primary_image_url: "https://www.apple.com/v/airpods-max/k/images/meta/airpods-max_overview__c2mz40a3bugm_og.png?202608111253",
    gallery_images: [
      "https://www.apple.com/v/airpods-max/k/images/meta/airpods-max_overview__c2mz40a3bugm_og.png?202608111253",
    ],
    image_source: "approved_affiliate_source",
    image_alt: "Apple AirPods Max Sky Blue",
    source_product_id: null,
    image_verified: true,
    image_last_checked: new Date().toISOString(),
  },
  "samsung galaxy s25 ultra 512gb": {
    primary_image_url: "https://image-us.samsung.com/us/smartphones/galaxy-s25-ultra/images/galaxy-s25-ultra-features-kv.jpg?imbypass=true",
    gallery_images: [
      "https://image-us.samsung.com/us/smartphones/galaxy-s25-ultra/images/galaxy-s25-ultra-features-kv.jpg?imbypass=true",
    ],
    image_source: "approved_affiliate_source",
    image_alt: "Samsung Galaxy S25 Ultra",
    source_product_id: null,
    image_verified: true,
    image_last_checked: new Date().toISOString(),
  },
  "iphone 15 pro 128gb": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Apple iPhone 15 Pro smartphone",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "sony wh 1000xm5": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Sony WH-1000XM5 headphones",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "nintendo switch oled console": {
    primary_image_url: "https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_1.5/c_scale,w_600/ncom/en_US/switch/site-design-update/features-hardware-oled",
    gallery_images: [
      "https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_1.5/c_scale,w_600/ncom/en_US/switch/site-design-update/features-hardware-oled",
    ],
    image_source: "approved_affiliate_source",
    image_alt: "Nintendo Switch OLED console",
    source_product_id: null,
    image_verified: true,
    image_last_checked: new Date().toISOString(),
  },
  "pelle pelle soda club leather jacket": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Pelle Pelle Soda Club Leather Jacket",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "pelle pelle world tour varsity jacket": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Pelle Pelle World Tour Varsity Jacket",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "vintage selvedge denim jacket": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Vintage Selvedge Denim Jacket",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "leather chelsea boots": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Leather Chelsea Boots",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "14k miami cuban link chain 22in 8mm": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "14K Miami Cuban Link Chain",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "10k diamond cuban link chain 24in 12mm": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "10K Diamond Cuban Link Chain",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "14k yellow gold chain 20in 4mm": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "14K Yellow Gold Chain",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "diamond stud earrings 1 0ct tw": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Diamond Stud Earrings",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "14k gold hoop earrings 30mm": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "14K Gold Hoop Earrings",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "14k gold tennis bracelet 7 5in": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "14K Gold Tennis Bracelet",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "18k gold signet ring": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "18K Gold Signet Ring",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "emerald pendant necklace 14k": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Emerald Pendant Necklace 14K",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "vintage 1980s gold dress watch": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Vintage Gold Dress Watch",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "men s onyx ring 10k": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Men's Onyx Ring 10K",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "women s diamond halo ring 1 5ct": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Women's Diamond Halo Ring 1.5ct",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "bleu de chanel eau de parfum 100ml": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Bleu de Chanel Eau de Parfum 100ml",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "maison margiela jazz club edt 100ml": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Maison Margiela Jazz Club EDT 100ml",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "jo malone peony blush suede 100ml": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Jo Malone Peony & Blush Suede 100ml",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "vintage guerlain shalimar parfum 30ml": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Vintage Guerlain Shalimar Parfum 30ml",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "solid walnut dining table": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Solid Walnut Dining Table",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "mid century accent chair": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Mid-Century Accent Chair",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "linen sectional sofa": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Linen Sectional Sofa",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "shure sm7b vocal microphone": {
    primary_image_url: "https://products.shureweb.eu/shure_product_db/product_main_images/files/3ac/40e/15-/setcard/cb0c8564fc691fe2ff3d2b67889ab1c2.jpeg",
    gallery_images: [
      "https://products.shureweb.eu/shure_product_db/product_main_images/files/3ac/40e/15-/setcard/cb0c8564fc691fe2ff3d2b67889ab1c2.jpeg",
    ],
    image_source: "approved_affiliate_source",
    image_alt: "Shure SM7B vocal microphone",
    source_product_id: null,
    image_verified: true,
    image_last_checked: new Date().toISOString(),
  },
  "focusrite scarlett 4i4 4th gen": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Focusrite Scarlett 4i4",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "universal audio apollo twin x": {
    primary_image_url: "https://www.uaudio.com/cdn/shop/files/apollo_twin_x_gallery_1_tec.png?crop=center&height=1024&v=1771946781&width=1024",
    gallery_images: [
      "https://www.uaudio.com/cdn/shop/files/apollo_twin_x_gallery_1_tec.png?crop=center&height=1024&v=1771946781&width=1024",
    ],
    image_source: "approved_affiliate_source",
    image_alt: "Universal Audio Apollo Twin X",
    source_product_id: null,
    image_verified: true,
    image_last_checked: new Date().toISOString(),
  },
  "nintendo 64 console gray": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Nintendo 64 Console",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "super mario 64 cartridge n64": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Super Mario 64 cartridge",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "wwe ultimate edition action figure": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "WWE Ultimate Edition action figure",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "1999 pokemon base set blastoise raw": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "1999 Pokemon Base Set Blastoise",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "adjustable dumbbell pair 5 50lb": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Adjustable dumbbell pair",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "blue yeti usb microphone": {
    primary_image_url: "https://resource.logitechg.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/streaming-gear/yeti-premium-usb-microphone/2025/gallery/yeti-front-angle-blackout-gallery-1.png",
    gallery_images: [
      "https://resource.logitechg.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/streaming-gear/yeti-premium-usb-microphone/2025/gallery/yeti-front-angle-blackout-gallery-1.png",
    ],
    image_source: "approved_affiliate_source",
    image_alt: "Blue Yeti USB microphone",
    source_product_id: null,
    image_verified: true,
    image_last_checked: new Date().toISOString(),
  },
  "brass floor lamp": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Brass Floor Lamp",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "vintage mirror set": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Vintage Mirror Set",
    source_product_id: null,
    image_verified: false,
    image_last_checked: new Date().toISOString(),
  },
  "collectible wrestling figure": {
    primary_image_url: PRODUCT_IMAGE_UNAVAILABLE,
    gallery_images: [PRODUCT_IMAGE_UNAVAILABLE],
    image_source: "placeholder",
    image_alt: "Collectible Wrestling Figure",
    source_product_id: null,
    image_verified: false,
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
