export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatRate(rate: number): string {
  return rate.toFixed(4);
}

export function formatDuration(hours: number): string {
  if (hours < 1) {
    return `~${Math.round(hours * 60)} min`;
  }
  if (hours < 24) {
    return `~${hours} hr`;
  }
  const days = Math.round(hours / 24);
  return `~${days} day${days > 1 ? "s" : ""}`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}
