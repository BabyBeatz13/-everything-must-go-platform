export const DEFAULT_COMMISSION_PERCENT = 8;

export function getMarketplaceCommissionPercent() {
  const raw = process.env.MARKETPLACE_COMMISSION_PERCENT;
  const parsed = Number(raw);

  if (!Number.isFinite(parsed) || parsed <= 0 || parsed >= 100) {
    return DEFAULT_COMMISSION_PERCENT;
  }

  return parsed;
}

export function dollarsToCents(amount: number | string) {
  const numeric = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(numeric)) return 0;
  return Math.round(numeric * 100);
}

export function centsToDollars(cents: number) {
  return cents / 100;
}

export function calculateCommissionCents(itemSubtotalCents: number) {
  const pct = getMarketplaceCommissionPercent();
  return Math.round(itemSubtotalCents * (pct / 100));
}

export function formatUsdFromCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}
