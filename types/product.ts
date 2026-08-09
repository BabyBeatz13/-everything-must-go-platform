export type ProductCategory =
  | "Electronics"
  | "Phones"
  | "Computers"
  | "Gaming"
  | "Fashion"
  | "Sneakers"
  | "Fan Apparel"
  | "Beauty"
  | "Fitness"
  | "Health"
  | "Health & Wellness"
  | "Home"
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
