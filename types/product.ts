export type ProductCategory =
  | "Electronics"
  | "Fashion"
  | "Beauty"
  | "Fitness"
  | "Home"
  | "Studio"
  | "Pet Supplies"
  | "Health";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  brand: string;
  merchant: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  affiliateUrl: string;
  featured: boolean;
  inStock: boolean;
};
