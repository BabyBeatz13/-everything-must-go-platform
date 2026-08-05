export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type MarketplaceDatabase = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: "customer" | "vendor" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "customer" | "vendor" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "customer" | "vendor" | "admin";
          created_at?: string;
          updated_at?: string;
        };
      };
      vendors: {
        Row: {
          id: string;
          profile_id: string | null;
          business_name: string;
          business_slug: string;
          status: "pending" | "active" | "suspended";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          business_name: string;
          business_slug: string;
          status?: "pending" | "active" | "suspended";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string | null;
          business_name?: string;
          business_slug?: string;
          status?: "pending" | "active" | "suspended";
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          parent_id: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          parent_id?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          parent_id?: string | null;
          description?: string | null;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          vendor_id: string | null;
          category_id: string | null;
          title: string;
          description: string | null;
          price: number;
          inventory: number;
          shipping: string;
          commission_percentage: number;
          status: "draft" | "active" | "paused" | "archived";
          is_featured: boolean;
          in_stock: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vendor_id?: string | null;
          category_id?: string | null;
          title: string;
          description?: string | null;
          price?: number;
          inventory?: number;
          shipping?: string;
          commission_percentage?: number;
          status?: "draft" | "active" | "paused" | "archived";
          is_featured?: boolean;
          in_stock?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vendor_id?: string | null;
          category_id?: string | null;
          title?: string;
          description?: string | null;
          price?: number;
          inventory?: number;
          shipping?: string;
          commission_percentage?: number;
          status?: "draft" | "active" | "paused" | "archived";
          is_featured?: boolean;
          in_stock?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string | null;
          image_url: string;
          alt_text: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          image_url: string;
          alt_text?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          image_url?: string;
          alt_text?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      affiliate_products: {
        Row: {
          id: string;
          product_id: string | null;
          merchant: "amazon" | "walmart" | "ebay" | "etsy" | "best_buy" | "sweetwater" | "stockx" | "goat" | "newegg";
          affiliate_url: string;
          commission_rate: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          merchant: "amazon" | "walmart" | "ebay" | "etsy" | "best_buy" | "sweetwater" | "stockx" | "goat" | "newegg";
          affiliate_url: string;
          commission_rate?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          merchant?: "amazon" | "walmart" | "ebay" | "etsy" | "best_buy" | "sweetwater" | "stockx" | "goat" | "newegg";
          affiliate_url?: string;
          commission_rate?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_id: string | null;
          status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
          total_amount: number;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id?: string | null;
          status?: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
          total_amount?: number;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string | null;
          status?: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
          total_amount?: number;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string | null;
          product_id: string | null;
          quantity: number;
          unit_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id?: string | null;
          product_id?: string | null;
          quantity?: number;
          unit_price?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string | null;
          product_id?: string | null;
          quantity?: number;
          unit_price?: number;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          profile_id: string | null;
          product_id: string | null;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          product_id?: string | null;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string | null;
          product_id?: string | null;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          profile_id: string | null;
          product_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          product_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string | null;
          product_id?: string | null;
          created_at?: string;
        };
      };
      carts: {
        Row: {
          id: string;
          profile_id: string | null;
          status: "active" | "saved" | "converted";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          status?: "active" | "saved" | "converted";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string | null;
          status?: "active" | "saved" | "converted";
          created_at?: string;
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          cart_id: string | null;
          product_id: string | null;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          cart_id?: string | null;
          product_id?: string | null;
          quantity?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          cart_id?: string | null;
          product_id?: string | null;
          quantity?: number;
          created_at?: string;
        };
      };
    };
  };
};

export type Profile = MarketplaceDatabase["public"]["Tables"]["profiles"]["Row"];
export type Vendor = MarketplaceDatabase["public"]["Tables"]["vendors"]["Row"];
export type Category = MarketplaceDatabase["public"]["Tables"]["categories"]["Row"];
export type Product = MarketplaceDatabase["public"]["Tables"]["products"]["Row"];
export type ProductImage = MarketplaceDatabase["public"]["Tables"]["product_images"]["Row"];
export type AffiliateProduct = MarketplaceDatabase["public"]["Tables"]["affiliate_products"]["Row"];
export type Order = MarketplaceDatabase["public"]["Tables"]["orders"]["Row"];
export type OrderItem = MarketplaceDatabase["public"]["Tables"]["order_items"]["Row"];
export type Review = MarketplaceDatabase["public"]["Tables"]["reviews"]["Row"];
export type Favorite = MarketplaceDatabase["public"]["Tables"]["favorites"]["Row"];
export type Cart = MarketplaceDatabase["public"]["Tables"]["carts"]["Row"];
export type CartItem = MarketplaceDatabase["public"]["Tables"]["cart_items"]["Row"];
