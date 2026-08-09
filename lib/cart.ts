"use client";

import { getMarketplaceProductById, type MarketplaceProductCardView } from "./marketplace";
import { supabaseMarketplace } from "./supabase-marketplace";
import { isSupabaseConfigured, supabase } from "./supabase";

const GUEST_CART_STORAGE_KEY = "emg-guest-cart-v1";
const USER_CART_STORAGE_KEY_PREFIX = "emg-user-cart-v1:";
const CART_UPDATE_EVENT = "emg-cart-updated";

export type CartItem = {
  marketplaceProductId: string;
  sellerId: string | null;
  title: string;
  image: string;
  storeName: string;
  unitPrice: number;
  shippingPrice: number;
  freeShipping: boolean;
  quantity: number;
  inventory: number;
  inStock: boolean;
  condition: string;
  category: string;
  status: "draft" | "active" | "paused" | "archived";
  updatedAt: string;
};

export type CartTotals = {
  merchandiseSubtotal: number;
  shippingSubtotal: number;
  estimatedTax: number;
  grandTotal: number;
};

type AccountSession = {
  email: string;
  name: string;
  authenticated: boolean;
};

function getAccountSession(): AccountSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("emg-account-session");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AccountSession;
  } catch {
    return null;
  }
}

function getStorageKey(session?: AccountSession | null) {
  if (session?.authenticated && session.email) {
    return `${USER_CART_STORAGE_KEY_PREFIX}${session.email.toLowerCase()}`;
  }

  return GUEST_CART_STORAGE_KEY;
}

function readLocalCart(key: string): CartItem[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(key);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalCart(key: string, items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_UPDATE_EVENT));
}

function mergeItems(base: CartItem[], incoming: CartItem[]) {
  const map = new Map(base.map((item) => [item.marketplaceProductId, item]));

  for (const next of incoming) {
    const current = map.get(next.marketplaceProductId);
    if (!current) {
      map.set(next.marketplaceProductId, next);
      continue;
    }

    const maxAllowed = Math.max(current.inventory, next.inventory, 0);
    map.set(next.marketplaceProductId, {
      ...current,
      ...next,
      quantity: Math.min(current.quantity + next.quantity, maxAllowed),
    });
  }

  return Array.from(map.values());
}

async function getAuthenticatedUserId() {
  if (!isSupabaseConfigured()) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

async function getOrCreateActiveCartId(profileId: string) {
  const { data: existing } = await supabaseMarketplace
    .from("carts")
    .select("id")
    .eq("profile_id", profileId)
    .eq("status", "active")
    .maybeSingle();

  if (existing?.id) return String(existing.id);

  const { data: inserted, error } = await supabaseMarketplace
    .from("carts")
    .insert({ profile_id: profileId, status: "active" })
    .select("id")
    .single();

  if (error || !inserted?.id) {
    throw new Error("Unable to initialize customer cart.");
  }

  return String(inserted.id);
}

async function syncLocalCartToSupabase(localItems: CartItem[]) {
  const profileId = await getAuthenticatedUserId();
  if (!profileId) return;

  const cartId = await getOrCreateActiveCartId(profileId);

  const { data: remoteRows } = await supabaseMarketplace
    .from("cart_items")
    .select("id, marketplace_product_id")
    .eq("cart_id", cartId);

  const remoteByProductId = new Map<string, string>();
  (remoteRows ?? []).forEach((row: Record<string, unknown>) => {
    remoteByProductId.set(String(row.marketplace_product_id), String(row.id));
  });

  for (const item of localItems) {
    await supabaseMarketplace
      .from("cart_items")
      .upsert(
        {
          cart_id: cartId,
          marketplace_product_id: item.marketplaceProductId,
          seller_id: item.sellerId,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          shipping_price: item.shippingPrice,
          product_title_snapshot: item.title,
          product_image_snapshot: item.image,
          store_name_snapshot: item.storeName,
          condition_snapshot: item.condition,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "cart_id,marketplace_product_id" },
      );

    remoteByProductId.delete(item.marketplaceProductId);
  }

  for (const staleRowId of remoteByProductId.values()) {
    await supabaseMarketplace.from("cart_items").delete().eq("id", staleRowId);
  }
}

async function refreshProductData(item: CartItem) {
  const live = await getMarketplaceProductById(item.marketplaceProductId);
  if (!live) {
    return {
      ...item,
      inStock: false,
      inventory: 0,
      status: "archived" as const,
      quantity: 0,
    };
  }

  return {
    ...item,
    title: live.title,
    image: live.image,
    storeName: live.storeName,
    unitPrice: live.price,
    shippingPrice: live.freeShipping ? 0 : live.shippingPrice,
    freeShipping: live.freeShipping,
    inventory: live.inventory,
    inStock: live.inStock,
    condition: live.condition,
    category: live.category,
    sellerId: live.sellerId,
    status: live.status,
    quantity: Math.min(item.quantity, Math.max(live.inventory, 0)),
    updatedAt: new Date().toISOString(),
  };
}

export function getCartCountSync() {
  const session = getAccountSession();
  const items = readLocalCart(getStorageKey(session));
  return items.reduce((count, item) => count + item.quantity, 0);
}

export async function getCartItems() {
  const session = getAccountSession();
  const storageKey = getStorageKey(session);
  const localItems = readLocalCart(storageKey);

  const hydratedItems = await Promise.all(localItems.map((item) => refreshProductData(item)));
  const validItems = hydratedItems.filter((item) => item.quantity > 0);

  writeLocalCart(storageKey, validItems);

  if (session?.authenticated && isSupabaseConfigured()) {
    try {
      await syncLocalCartToSupabase(validItems);
    } catch {
      // Keep local cart functional even if Supabase sync is temporarily unavailable.
    }
  }

  return validItems;
}

export async function addMarketplaceProductToCart(product: MarketplaceProductCardView, quantity = 1) {
  if (!product.inStock || product.status !== "active") {
    return { ok: false, error: "This product is currently unavailable." };
  }

  const session = getAccountSession();
  const storageKey = getStorageKey(session);
  const items = readLocalCart(storageKey);

  const index = items.findIndex((item) => item.marketplaceProductId === product.id);
  const nextQuantity = (index >= 0 ? items[index].quantity : 0) + quantity;

  if (nextQuantity > product.inventory) {
    return { ok: false, error: `Only ${product.inventory} units are currently available.` };
  }

  const nextItem: CartItem = {
    marketplaceProductId: product.id,
    sellerId: product.sellerId,
    title: product.title,
    image: product.image,
    storeName: product.storeName,
    unitPrice: product.price,
    shippingPrice: product.freeShipping ? 0 : product.shippingPrice,
    freeShipping: product.freeShipping,
    quantity: nextQuantity,
    inventory: product.inventory,
    inStock: product.inStock,
    condition: product.condition,
    category: product.category,
    status: product.status,
    updatedAt: new Date().toISOString(),
  };

  const nextItems = index >= 0
    ? items.map((item, i) => (i === index ? nextItem : item))
    : [...items, nextItem];

  writeLocalCart(storageKey, nextItems);

  if (session?.authenticated && isSupabaseConfigured()) {
    try {
      await syncLocalCartToSupabase(nextItems);
    } catch {
      // Keep local cart functional even if Supabase sync is temporarily unavailable.
    }
  }

  return { ok: true };
}

export async function updateCartItemQuantity(productId: string, quantity: number) {
  const session = getAccountSession();
  const storageKey = getStorageKey(session);
  const items = readLocalCart(storageKey);
  const index = items.findIndex((item) => item.marketplaceProductId === productId);

  if (index < 0) {
    return { ok: false, error: "Cart item was not found." };
  }

  const updated = await refreshProductData(items[index]);
  if (updated.status !== "active" || !updated.inStock) {
    return { ok: false, error: "This product is currently unavailable." };
  }

  const nextQuantity = Math.max(1, Math.min(quantity, updated.inventory));
  const nextItems = items.map((item, i) => (i === index ? { ...updated, quantity: nextQuantity } : item));

  writeLocalCart(storageKey, nextItems);

  if (session?.authenticated && isSupabaseConfigured()) {
    try {
      await syncLocalCartToSupabase(nextItems);
    } catch {
      // Keep local cart functional even if Supabase sync is temporarily unavailable.
    }
  }

  return { ok: true, quantity: nextQuantity };
}

export async function removeCartItem(productId: string) {
  const session = getAccountSession();
  const storageKey = getStorageKey(session);
  const items = readLocalCart(storageKey);
  const nextItems = items.filter((item) => item.marketplaceProductId !== productId);

  writeLocalCart(storageKey, nextItems);

  if (session?.authenticated && isSupabaseConfigured()) {
    try {
      await syncLocalCartToSupabase(nextItems);
    } catch {
      // Keep local cart functional even if Supabase sync is temporarily unavailable.
    }
  }

  return { ok: true };
}

export async function clearCart() {
  const session = getAccountSession();
  const storageKey = getStorageKey(session);
  writeLocalCart(storageKey, []);

  if (session?.authenticated && isSupabaseConfigured()) {
    try {
      await syncLocalCartToSupabase([]);
    } catch {
      // Keep local cart functional even if Supabase sync is temporarily unavailable.
    }
  }
}

export async function mergeGuestCartIntoAuthenticatedCart() {
  const session = getAccountSession();
  if (!session?.authenticated) return;

  const guestItems = readLocalCart(GUEST_CART_STORAGE_KEY);
  if (guestItems.length === 0) return;

  const userKey = getStorageKey(session);
  const userItems = readLocalCart(userKey);
  const merged = mergeItems(userItems, guestItems);

  writeLocalCart(userKey, merged);
  writeLocalCart(GUEST_CART_STORAGE_KEY, []);

  if (isSupabaseConfigured()) {
    try {
      await syncLocalCartToSupabase(merged);
    } catch {
      // Keep local cart functional even if Supabase sync is temporarily unavailable.
    }
  }
}

export function subscribeToCartUpdates(onUpdate: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = () => onUpdate();
  window.addEventListener(CART_UPDATE_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(CART_UPDATE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function calculateCartTotals(items: CartItem[]): CartTotals {
  const merchandiseSubtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shippingSubtotal = items.reduce(
    (sum, item) => sum + (item.freeShipping ? 0 : item.shippingPrice * item.quantity),
    0,
  );
  const estimatedTax = 0;

  return {
    merchandiseSubtotal,
    shippingSubtotal,
    estimatedTax,
    grandTotal: merchandiseSubtotal + shippingSubtotal + estimatedTax,
  };
}

export function groupCartItemsBySeller(items: CartItem[]) {
  return items.reduce<Record<string, CartItem[]>>((groups, item) => {
    const key = item.storeName || "Independent Seller";
    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(item);
    return groups;
  }, {});
}
