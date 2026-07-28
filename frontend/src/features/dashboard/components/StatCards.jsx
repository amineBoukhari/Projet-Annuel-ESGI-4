import {
  Receipt,
  TrendingUp,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatValue } from "../../../utils/formatters";

const CURRENCY_SYMBOL = "€";

export default function StatCards({ stats, loading }) {
  const STAT_CARDS = [
    {
      label: "Factures ce mois",
      icon: Receipt,
      value: stats?.invoiceCount ?? null,
      trend: stats?.invoiceTrend ?? null,
    },
    {
      label: "Chiffre d'affaires",
      icon: TrendingUp,
      value:
        stats?.revenue != null
          ? `${Number(stats.revenue).toFixed(0)} ${CURRENCY_SYMBOL}`
          : null,
      trend: stats?.revenueTrend ?? null,
    },
    {
      label: "Utilisateurs",
      icon: Users,
      value: stats?.userCount ?? null,
      trend: null,
    },
    {
      label: "Charges ce mois", // J'ai remplacé "Dépenses" par "Charges" selon ton plan d'action !
      icon: Package,
      value: stats?.expenseCount ?? null,
      trend: stats?.expenseTrend ?? null,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STAT_CARDS.map((card, idx) => {
        const Icon = card.icon;
        const rawValue = loading ? null : card.value;
        const formatted = formatValue(rawValue);

        return (
          <div
            key={idx}
            className="bg-surface-raised rounded-[16px] p-5 shadow-ambient hover:shadow-lifted transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center">
                <Icon size={18} strokeWidth={2} />
              </div>
              {card.trend && card.trend.value && (
                <div
                  className={`flex items-center gap-1 text-[0.75rem] font-medium ${card.trend.positive ? "text-success" : "text-error"}`}
                >
                  {card.trend.positive ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                  {card.trend.value}
                </div>
              )}
            </div>
            <div className="mt-3">
              <p className="text-[0.8125rem] text-ink-muted font-medium">
                {card.label}
              </p>
              <p
                className={`text-[1.5rem] font-semibold mt-0.5 ${formatted.muted ? "text-ink-muted" : "text-ink"}`}
              >
                {formatted.text}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
