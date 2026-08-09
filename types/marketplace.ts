export const marketplaceCategories = [
  "Electronics",
  "Phones",
  "Computers",
  "Gaming",
  "Fashion",
  "Sneakers",
  "Fan Apparel",
  "Beauty",
  "Fitness",
  "Health",
  "Health & Wellness",
  "Home",
  "Home & Furniture",
  "Home Decor",
  "Dressers",
  "Mirrors",
  "Lamps",
  "Vases",
  "Garden",
  "Fruit Seeds",
  "Vegetable Seeds",
  "Herb Seeds",
  "Flower Seeds",
  "Studio",
  "Studio Equipment",
  "Music Software",
  "Collectibles",
  "Vintage Toys",
  "Wrestling Figures",
  "Wrestling Memorabilia",
  "Sports Cards",
  "Trading Cards",
  "Funko Pops",
  "Hot Wheels",
  "LEGO",
  "Comics",
  "Retro Gaming",
  "Pet Supplies",
] as const;

export type MarketplaceCategory = (typeof marketplaceCategories)[number];

export const productConditions = ["New", "Used", "Vintage", "Collectible", "Refurbished"] as const;
export type ProductCondition = (typeof productConditions)[number];

export type SellerApprovalStatus = "Pending" | "Approved" | "Rejected" | "Suspended";

export type CustomerAddress = {
  id: string;
  label: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  default: boolean;
};

export type CustomerWishlistItem = {
  id: string;
  productId: string;
  title: string;
  price: number;
  imageUrl: string;
};

export type RecentlyViewedItem = {
  id: string;
  productId: string;
  title: string;
  price: number;
  imageUrl: string;
  viewedAt: string;
};

export type AccountOrder = {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: number;
};

export type SellerProfile = {
  id: string;
  profileId: string;
  storeName: string;
  logoUrl: string;
  bio: string;
  contactEmail: string;
  status: SellerApprovalStatus;
  createdAt: string;
  updatedAt: string;
};

export type SellerApplication = {
  id: string;
  profileId: string;
  businessName: string;
  storeName: string;
  email: string;
  bio: string;
  status: SellerApprovalStatus;
  submittedAt: string;
};

export type MarketplaceProduct = {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: MarketplaceCategory;
  subcategory: string;
  brand: string;
  price: number;
  compareAtPrice: number;
  inventoryQuantity: number;
  sku: string;
  condition: ProductCondition;
  shippingPrice: number;
  freeShipping: boolean;
  imageUrls: string[];
  featured: boolean;
  status: "draft" | "active" | "paused" | "archived";
  createdAt: string;
  updatedAt: string;
};

export type SellerListingApproval = {
  id: string;
  sellerId: string;
  storeName: string;
  status: SellerApprovalStatus;
  notes: string;
  submittedAt: string;
};
