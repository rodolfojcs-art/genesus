/**
 * TerraMercado — Catalog utility functions
 */

export function formatPrice(price: number, moneda: "USD" | "VES"): string {
  if (moneda === "USD") {
    return `$${price.toFixed(2)}`;
  }
  // VES: thousands separator with period, decimal with comma
  const formatted = price.toLocaleString("es-VE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `Bs. ${formatted}`;
}

export function terraScoreColor(score: number): string {
  if (score >= 800) return "text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900";
  if (score >= 600) return "text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900";
  return "text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900";
}

export function generateSlug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accent marks
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
