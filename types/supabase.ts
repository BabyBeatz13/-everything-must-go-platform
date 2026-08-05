export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "customer" | "vendor" | "admin";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
      };
      vendors: {
        Row: {
          id: string;
          profile_id: string | null;
          business_name: string | null;
          business_slug: string | null;
          status: "pending" | "active" | "suspended";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          business_name?: string | null;
          business_slug?: string | null;
          status?: "pending" | "active" | "suspended";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string | null;
          business_name?: string | null;
          business_slug?: string | null;
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
          name: string;
          slug: string;
          description: string | null;
          price: number;
          currency: string;
          image_url: string | null;
          is_featured: boolean;
          in_stock: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vendor_id?: string | null;
          category_id?: string | null;
          name: string;
          slug: string;
          description?: string | null;
          price?: number;
          currency?: string;
          image_url?: string | null;
          is_featured?: boolean;
          in_stock?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vendor_id?: string | null;
          category_id?: string | null;
          name?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          currency?: string;
          image_url?: string | null;
          is_featured?: boolean;
          in_stock?: boolean;
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
    };
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Vendor = Database["public"]["Tables"]["vendors"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Favorite = Database["public"]["Tables"]["favorites"]["Row"];
