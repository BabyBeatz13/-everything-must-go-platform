export type ProductCategory =
  | "Electronics"
  | "Phones"
  | "Computers"
  | "Gaming"
  | "Fashion"
  | "Sneakers"
  | "Fan Apparel"
  | "Beauty"
  | "Fragrance"
  | "Fitness"
  | "Health"
  | "Health & Wellness"
  | "Home"
  | "Jewelry"
  | "Vintage Gaming"
  | "Collectibles"
  | "Fine Jewelry"
  | "Gold Jewelry"
  | "Diamond Jewelry"
  | "Home & Furniture"
  | "Home Decor"
  | "Dressers"
  | "Mirrors"
  | "Lamps"
  | "Vases"
  | "Garden"
  | "Fruit Seeds"
  | "Vegetable Seeds"
  | "Herb Seeds"
  | "Flower Seeds"
  | "Studio"
  | "Studio Equipment"
  | "Music Software"
  | "Collectibles"
  | "Vintage Toys"
  | "Wrestling Figures"
  | "Wrestling Memorabilia"
  | "Sports Cards"
  | "Trading Cards"
  | "Funko Pops"
  | "Hot Wheels"
  | "LEGO"
  | "Comics"
  | "Retro Gaming"
  | "Pet Supplies";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  subcategory?: string;
  brand: string;
  merchant: string;
  description: string;
  image: string;
  imageSource?: "seller_upload" | "approved_affiliate_source" | "merchant_feed" | "admin_curated" | "development_seed" | "placeholder";
  price: number;
  rating: number;
  affiliateUrl: string;
  sourceType?: "seller" | "affiliate" | "admin_curated" | "merchant_feed" | "development_seed";
  authenticityStatus?: "verified" | "authentic" | "pending_review" | "not_required" | "test_only";
  tags?: string[];
  searchKeywords?: string[];
  year?: number;
  metal?: string;
  karat?: string;
  weight?: string;
  chainLength?: string;
  chainWidth?: string;
  stone?: string;
  diamondType?: string;
  caratWeight?: string;
  certification?: string;
  featured: boolean;
  inStock: boolean;
};
