// ---------------------------------------------------------------------------
// formatCurrency
// ---------------------------------------------------------------------------
// Single place to format money. The backend charges in USD (see payment
// service), so that's the default; change it here if the store's currency ever
// changes and every price across the app updates.
// ---------------------------------------------------------------------------

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

/** Discount percentage from a compare-at ("was") price, rounded; 0 if none. */
export function discountPercent(price: number, compareAtPrice?: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
