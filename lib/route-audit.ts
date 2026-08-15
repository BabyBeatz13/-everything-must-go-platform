export const canonicalCategoryRoutes: Record<string, string> = {
  electronics: "/category/electronics",
  fashion: "/category/fashion",
  beauty: "/category/beauty",
  fitness: "/category/fitness",
  home: "/category/home",
  studio: "/category/studio",
  "pet supplies": "/category/pet-supplies",
  health: "/category/health",
  "studio equipment": "/category/studio",
  jewelry: "/category/fashion",
  "gold jewelry": "/category/fashion",
  "diamond jewelry": "/category/fashion",
  fragrances: "/category/beauty",
  cologne: "/category/beauty",
  perfume: "/category/beauty",
  vintage: "/category/fashion",
  collectibles: "/category/home",
};

export const internalRouteAudit = [
  "/",
  "/search",
  "/cart",
  "/checkout",
  "/checkout/cancel",
  "/checkout/success",
  "/login",
  "/sign-up",
  "/forgot-password",
  "/support",
  "/support/new",
  "/support/tickets",
  "/help",
  "/legal",
  "/legal/terms",
  "/legal/privacy",
  "/legal/seller-agreement",
  "/legal/customer-protection",
  "/legal/returns",
  "/legal/refunds",
  "/legal/shipping",
  "/legal/authenticity",
  "/legal/prohibited-items",
  "/legal/acceptable-use",
  "/legal/cookies",
  "/cookie-settings",
  "/account",
  "/account/profile",
  "/account/addresses",
  "/account/wishlist",
  "/account/recently-viewed",
  "/account/orders",
  "/account/cases",
  "/account/cart",
  "/account/privacy",
  "/seller",
  "/seller/apply",
  "/seller/onboarding",
  "/seller/dashboard",
  "/seller/products",
  "/seller/products/new",
  "/seller/orders",
  "/seller/shipping",
  "/seller/cases",
  "/seller/customers",
  "/seller/analytics",
  "/seller/earnings",
  "/seller/payments",
  "/seller/payments/onboarding",
  "/seller/payments/return",
  "/seller/profile",
  "/admin",
  "/admin/dashboard",
  "/admin/users",
  "/admin/sellers",
  "/admin/listings",
  "/admin/orders",
  "/admin/shipping",
  "/admin/shipments",
  "/admin/payments",
  "/admin/payouts",
  "/admin/refunds",
  "/admin/returns",
  "/admin/cases",
  "/admin/authenticity",
  "/admin/reviews",
  "/admin/categories",
  "/admin/promotions",
  "/admin/notifications",
  "/admin/reports",
  "/admin/risk",
  "/admin/settings/fees",
  "/admin/compliance",
  "/admin/compliance/policies",
  "/admin/compliance/reports",
  "/admin/compliance/violations",
  "/admin/compliance/sellers",
  "/messages",
  "/messages/preview",
  "/staff",
  "/staff/dashboard",
  "/staff/tickets",
  "/report/ip",
  "/report/counterfeit",
  "/product/[id]",
  "/category/[slug]",
  "/store/[slug]",
  "/seller/[id]",
  "/orders/[id]",
  "/returns/[id]",
  "/support/[id]",
] as const;

export function slugifyCategory(category: string): string {
  return category
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");
}

export function getCategoryRoute(category: string): string {
  const normalized = category.trim().toLowerCase();
  const direct = canonicalCategoryRoutes[normalized];
  if (direct) return direct;
  return `/category/${slugifyCategory(category)}`;
}

export function isKnownInternalRoute(path: string): boolean {
  return internalRouteAudit.includes(path as (typeof internalRouteAudit)[number]);
}
