"use client";

import { supabase } from "./supabase";
import { getCurrentSellerProfile, getSupabaseAccessToken } from "./client-auth";

export type SellerProductForm = {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  brand: string;
  sku: string;
  status: "draft" | "active" | "paused" | "archived";
  price: number;
  compareAtPrice: number;
  inventoryQuantity: number;
  condition: "new" | "used" | "vintage" | "collectible" | "refurbished";
  shippingPrice: number;
  freeShipping: boolean;
  featured: boolean;
  slug: string;
  variantsJson: string;
  imagesCsv: string;
  shippingClass: string;
  weightGrams: number;
  seoTitle: string;
  seoDescription: string;
};

export type SellerDashboardMetrics = {
  totalRevenueCents: number;
  pendingPayoutCents: number;
  availableBalanceCents: number;
  totalOrders: number;
  productsSold: number;
  views: number;
  conversionRate: number;
  recentOrders: Array<Record<string, unknown>>;
  notifications: string[];
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export async function getSellerIdentity() {
  const seller = await getCurrentSellerProfile();
  if (!seller?.id || !seller.profile_id) return null;
  return {
    sellerId: String(seller.id),
    profileId: String(seller.profile_id),
    storeName: String(seller.store_name ?? "Seller store"),
    status: String(seller.status ?? "pending"),
    seller,
  };
}

export async function getSellerProductsPortal() {
  const identity = await getSellerIdentity();
  if (!identity) return [];

  const { data } = await supabase
    .from("marketplace_products")
    .select("*")
    .eq("seller_id", identity.sellerId)
    .order("created_at", { ascending: false });

  return (data as Array<Record<string, unknown>>) ?? [];
}

export async function getSellerDashboardMetrics(): Promise<SellerDashboardMetrics | null> {
  const identity = await getSellerIdentity();
  if (!identity) return null;

  const [
    earningsRes,
    transfersRes,
    orderItemsRes,
    ordersRes,
    productsRes,
  ] = await Promise.all([
    supabase.from("seller_earnings").select("seller_net_cents, earning_status").eq("seller_id", identity.sellerId),
    supabase.from("seller_transfers").select("seller_amount_cents, transfer_status").eq("seller_id", identity.sellerId),
    supabase.from("order_items").select("quantity").eq("seller_id", identity.sellerId),
    supabase.from("order_items").select("order_id, orders!inner(order_number, created_at, payment_status, fulfillment_status)").eq("seller_id", identity.sellerId),
    supabase.from("marketplace_products").select("view_count").eq("seller_id", identity.sellerId),
  ]);

  const earnings = (earningsRes.data as Array<Record<string, unknown>>) ?? [];
  const transfers = (transfersRes.data as Array<Record<string, unknown>>) ?? [];
  const orderItems = (orderItemsRes.data as Array<Record<string, unknown>>) ?? [];
  const ordersRaw = (ordersRes.data as Array<Record<string, unknown>>) ?? [];
  const products = (productsRes.data as Array<Record<string, unknown>>) ?? [];

  const totalRevenueCents = earnings.reduce((sum, row) => sum + Number(row.seller_net_cents ?? 0), 0);
  const pendingPayoutCents = transfers
    .filter((row) => String(row.transfer_status) === "pending")
    .reduce((sum, row) => sum + Number(row.seller_amount_cents ?? 0), 0);
  const availableBalanceCents = transfers
    .filter((row) => String(row.transfer_status) === "completed")
    .reduce((sum, row) => sum + Number(row.seller_amount_cents ?? 0), 0);

  const orderMap = new Map<string, Record<string, unknown>>();
  for (const row of ordersRaw) {
    orderMap.set(String(row.order_id), row.orders as Record<string, unknown>);
  }

  const recentOrders = Array.from(orderMap.entries())
    .map(([orderId, order]) => ({ orderId, ...order } as Record<string, unknown>))
    .sort((a, b) => String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")))
    .slice(0, 6);

  const totalOrders = orderMap.size;
  const productsSold = orderItems.reduce((sum, row) => sum + Number(row.quantity ?? 0), 0);
  const views = products.reduce((sum, row) => sum + Number(row.view_count ?? 0), 0);
  const conversionRate = views > 0 ? Number(((totalOrders / views) * 100).toFixed(2)) : 0;

  const notifications: string[] = [];
  if (pendingPayoutCents > 0) notifications.push("You have pending payouts waiting for transfer completion.");
  if (identity.status !== "approved") notifications.push("Seller account is not approved yet. Some features are limited.");
  if (recentOrders.length === 0) notifications.push("No recent orders yet. Promote featured products to drive traffic.");

  return {
    totalRevenueCents,
    pendingPayoutCents,
    availableBalanceCents,
    totalOrders,
    productsSold,
    views,
    conversionRate,
    recentOrders,
    notifications,
  };
}

export async function createSellerProductPortal(form: SellerProductForm) {
  const identity = await getSellerIdentity();
  if (!identity) {
    return { ok: false, error: "Seller profile not found." };
  }

  const payload: Record<string, unknown> = {
    seller_id: identity.sellerId,
    title: form.title,
    description: form.description,
    category: form.category,
    subcategory: form.subcategory || null,
    brand: form.brand || null,
    price: form.price,
    compare_at_price: form.compareAtPrice || null,
    inventory_quantity: form.inventoryQuantity,
    sku: form.sku,
    condition: form.condition,
    shipping_price: form.shippingPrice,
    free_shipping: form.freeShipping,
    featured: form.featured,
    status: form.status,
    product_images: form.imagesCsv.split(",").map((item) => item.trim()).filter(Boolean),
    slug: form.slug || toSlug(form.title),
    variants: safeParseJson(form.variantsJson, []),
    image_gallery: form.imagesCsv.split(",").map((item) => item.trim()).filter(Boolean),
    shipping_class: form.shippingClass || null,
    weight_grams: form.weightGrams || null,
    seo_title: form.seoTitle || null,
    seo_description: form.seoDescription || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("marketplace_products").insert(payload);
  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function updateSellerProductPortal(productId: string, form: SellerProductForm) {
  const payload: Record<string, unknown> = {
    title: form.title,
    description: form.description,
    category: form.category,
    subcategory: form.subcategory || null,
    brand: form.brand || null,
    price: form.price,
    compare_at_price: form.compareAtPrice || null,
    inventory_quantity: form.inventoryQuantity,
    sku: form.sku,
    condition: form.condition,
    shipping_price: form.shippingPrice,
    free_shipping: form.freeShipping,
    featured: form.featured,
    status: form.status,
    product_images: form.imagesCsv.split(",").map((item) => item.trim()).filter(Boolean),
    slug: form.slug || toSlug(form.title),
    variants: safeParseJson(form.variantsJson, []),
    image_gallery: form.imagesCsv.split(",").map((item) => item.trim()).filter(Boolean),
    shipping_class: form.shippingClass || null,
    weight_grams: form.weightGrams || null,
    seo_title: form.seoTitle || null,
    seo_description: form.seoDescription || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("marketplace_products")
    .update(payload)
    .eq("id", productId);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function deleteSellerProductPortal(productId: string) {
  const { error } = await supabase.from("marketplace_products").delete().eq("id", productId);
  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function getSellerProductByIdPortal(productId: string) {
  const { data, error } = await supabase
    .from("marketplace_products")
    .select("*")
    .eq("id", productId)
    .maybeSingle();

  if (error || !data) return null;
  return data as Record<string, unknown>;
}

export async function updateSellerProfilePortal(updates: Record<string, unknown>) {
  const identity = await getSellerIdentity();
  if (!identity) {
    return { ok: false, error: "Seller profile not found." };
  }

  const { error } = await supabase
    .from("seller_profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", identity.sellerId);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function getSellerCustomersPortal() {
  const identity = await getSellerIdentity();
  if (!identity) return [];

  const { data } = await supabase
    .from("order_items")
    .select("order_id, quantity, orders!inner(customer_id, order_number, created_at, payment_status)")
    .eq("seller_id", identity.sellerId);

  const customerMap = new Map<string, { customerId: string; totalOrders: number; itemsPurchased: number; lastOrderAt: string; orderNumbers: string[] }>();

  for (const row of (data as Array<Record<string, unknown>>) ?? []) {
    const order = row.orders as Record<string, unknown>;
    const customerId = String(order.customer_id ?? "");
    if (!customerId) continue;

    const current = customerMap.get(customerId) ?? {
      customerId,
      totalOrders: 0,
      itemsPurchased: 0,
      lastOrderAt: String(order.created_at ?? new Date().toISOString()),
      orderNumbers: [],
    };

    current.totalOrders += 1;
    current.itemsPurchased += Number(row.quantity ?? 0);
    current.lastOrderAt = String(order.created_at ?? current.lastOrderAt);
    current.orderNumbers.push(String(order.order_number ?? ""));

    customerMap.set(customerId, current);
  }

  const customerIds = Array.from(customerMap.keys());
  if (customerIds.length === 0) return [];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .in("id", customerIds);

  const profileMap = new Map(((profiles as Array<Record<string, unknown>>) ?? []).map((p) => [String(p.id), p]));

  return Array.from(customerMap.values()).map((entry) => {
    const profile = profileMap.get(entry.customerId);
    return {
      ...entry,
      email: String(profile?.email ?? "unknown"),
      fullName: String(profile?.full_name ?? "Customer"),
    };
  });
}

export async function getSellerOrdersPortal(status: string) {
  const identity = await getSellerIdentity();
  if (!identity) return [];

  let query = supabase
    .from("order_items")
    .select("order_id, quantity, seller_earnings_cents, fulfillment_status, refund_status, orders!inner(order_number, created_at, payment_status, fulfillment_status)")
    .eq("seller_id", identity.sellerId);

  if (status !== "all") {
    query = query.eq("orders.fulfillment_status", status);
  }

  const { data } = await query;
  const rows = (data as Array<Record<string, unknown>>) ?? [];

  const grouped = new Map<string, Record<string, unknown>>();
  for (const row of rows) {
    const order = row.orders as Record<string, unknown>;
    const orderId = String(row.order_id);

    const existing = grouped.get(orderId) ?? {
      orderId,
      orderNumber: String(order.order_number ?? orderId),
      createdAt: String(order.created_at ?? new Date().toISOString()),
      paymentStatus: String(order.payment_status ?? "pending_payment"),
      fulfillmentStatus: String(order.fulfillment_status ?? "pending_payment"),
      items: 0,
      sellerTotalCents: 0,
      refunds: 0,
    };

    existing.items = Number(existing.items) + Number(row.quantity ?? 0);
    existing.sellerTotalCents = Number(existing.sellerTotalCents) + Number(row.seller_earnings_cents ?? 0);
    if (String(row.refund_status ?? "none") !== "none") {
      existing.refunds = Number(existing.refunds) + 1;
    }

    grouped.set(orderId, existing);
  }

  return Array.from(grouped.values()).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

function safeParseJson<T>(raw: string, fallback: T): T {
  if (!raw.trim()) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function getSupabaseBearerForApi() {
  const token = await getSupabaseAccessToken();
  return token;
}
