export function formatValue(value) {
  if (value === null || value === undefined) return { text: "—", muted: true };
  if (value === 0 || value === "0 €")
    return { text: String(value), muted: true };
  return { text: String(value), muted: false };
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getWeekNumber(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diff = date - startOfYear;
  return Math.ceil((diff / 86400000 + startOfYear.getDay() + 1) / 7);
}

export function formatChartDate(dateStr, period) {
  const d = new Date(dateStr);
  if (period === "day")
    return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" });
  if (period === "week") return `S${getWeekNumber(d)}`;
  if (period === "month")
    return d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
  return d.getFullYear().toString();
}
