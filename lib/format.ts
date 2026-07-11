export function formatCentsAsCurrency(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}
