"use client";

import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { MarketplaceProductCardView } from "@/lib/marketplace";

export type CustomerWishlistItem = {
  id: string;
  productId: string;
  title: string;
  price: number;
  imageUrl: string;
  category?: string;
  storeName?: string;
};

export type RecentlyViewedItem = {
  id: string;
  productId: string;
  title: string;
  price: number;
  imageUrl: string;
  category?: string;
  storeName?: string;
  viewedAt: string;
};

const WISHLIST_KEY = "emg-wishlist";
const RECENT_KEY = "emg-recently-viewed";

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

async function getCurrentUserId(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user.id;
}

export async function getWishlistItems(): Promise<CustomerWishlistItem[]> {
  const userId = await getCurrentUserId();

  if (userId && isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from("customer_wishlist")
      .select("id, product_id, title, price, image_url, category, store_name")
      .eq("profile_id", userId)
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data)) {
      return (data as Array<Record<string, any>>).map((item) => ({
        id: String(item.id),
        productId: String(item.product_id),
        title: String(item.title ?? "Saved item"),
        price: Number(item.price ?? 0),
        imageUrl: String(item.image_url ?? "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80"),
        category: item.category ? String(item.category) : undefined,
        storeName: item.store_name ? String(item.store_name) : undefined,
      }));
    }
  }

  return readStorage<CustomerWishlistItem[]>(WISHLIST_KEY, []);
}

export async function toggleWishlistItem(product: Pick<MarketplaceProductCardView, "id" | "title" | "price" | "image" | "category" | "storeName">): Promise<boolean> {
  const userId = await getCurrentUserId();
  const existing = readStorage<CustomerWishlistItem[]>(WISHLIST_KEY, []);
  const item: CustomerWishlistItem = {
    id: `local-${product.id}`,
    productId: product.id,
    title: product.title,
    price: product.price,
    imageUrl: product.image,
    category: product.category,
    storeName: product.storeName,
  };

  const next = existing.some((entry) => entry.productId === product.id)
    ? existing.filter((entry) => entry.productId !== product.id)
    : [item, ...existing].slice(0, 30);

  writeStorage(WISHLIST_KEY, next);

  if (userId && isSupabaseConfigured()) {
    const match = next.find((entry) => entry.productId === product.id);
    if (match) {
      await supabase.from("customer_wishlist").upsert(
        {
          profile_id: userId,
          product_id: product.id,
          title: product.title,
          price: product.price,
          image_url: product.image,
          category: product.category,
          store_name: product.storeName,
        },
        { onConflict: "profile_id, product_id" },
      );
      return true;
    }

    await supabase.from("customer_wishlist").delete().eq("profile_id", userId).eq("product_id", product.id);
    return false;
  }

  return next.some((entry) => entry.productId === product.id);
}

export async function getRecentlyViewedItems(): Promise<RecentlyViewedItem[]> {
  const userId = await getCurrentUserId();

  if (userId && isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from("recently_viewed")
      .select("id, product_id, title, price, image_url, category, store_name, viewed_at")
      .eq("profile_id", userId)
      .order("viewed_at", { ascending: false })
      .limit(12);

    if (!error && Array.isArray(data)) {
      return (data as Array<Record<string, any>>).map((item) => ({
        id: String(item.id),
        productId: String(item.product_id),
        title: String(item.title ?? "Recently viewed item"),
        price: Number(item.price ?? 0),
        imageUrl: String(item.image_url ?? "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80"),
        category: item.category ? String(item.category) : undefined,
        storeName: item.store_name ? String(item.store_name) : undefined,
        viewedAt: item.viewed_at ? String(item.viewed_at) : new Date().toISOString(),
      }));
    }
  }

  return readStorage<RecentlyViewedItem[]>(RECENT_KEY, []);
}

export async function recordRecentlyViewedProduct(product: Pick<MarketplaceProductCardView, "id" | "title" | "price" | "image" | "category" | "storeName">) {
  const userId = await getCurrentUserId();
  const next = readStorage<RecentlyViewedItem[]>(RECENT_KEY, []);
  const timestamp = new Date().toISOString();
  const item: RecentlyViewedItem = {
    id: `local-${product.id}`,
    productId: product.id,
    title: product.title,
    price: product.price,
    imageUrl: product.image,
    category: product.category,
    storeName: product.storeName,
    viewedAt: timestamp,
  };

  const filtered = next.filter((entry) => entry.productId !== product.id);
  const updated = [item, ...filtered].slice(0, 12);
  writeStorage(RECENT_KEY, updated);

  if (userId && isSupabaseConfigured()) {
    await supabase.from("recently_viewed").upsert(
      {
        profile_id: userId,
        product_id: product.id,
        title: product.title,
        price: product.price,
        image_url: product.image,
        category: product.category,
        store_name: product.storeName,
        viewed_at: timestamp,
      },
      { onConflict: "profile_id, product_id" },
    );
  }
}
