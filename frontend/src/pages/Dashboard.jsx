import { useEffect, useState, useCallback } from "react";
import {
  Receipt,
  TrendingUp,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  FileText,
  DollarSign,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import dashboardService from "../services/dashboardService";

const PERIODS = [
  { key: "day", label: "Jour" },
  { key: "week", label: "Semaine" },
  { key: "month", label: "Mois" },
  { key: "year", label: "Année" },
];

function formatValue(value) {
  if (value === null || value === undefined) {
    return { text: "—", muted: true };
  }
  if (value === 0 || value === "0 €") {
    return { text: String(value), muted: true };
  }
  return { text: String(value), muted: false };
}

function StatusBadge({ status }) {
  const styles = {
    draft: "bg-amber-50 text-amber-700 border-amber-200",
    validated: "bg-blue-50 text-blue-700 border-blue-200",
    paid: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };
  const labels = {
    draft: "Brouillon",
    validated: "Validée",
    paid: "Payée",
    cancelled: "Annulée",
  };
  const s = styles[status] || "bg-gray-50 text-gray-700 border-gray-200";
  return (
    <span className={`text-[0.6875rem] font-medium px-2 py-0.5 rounded-[6px] border ${s}`}>
      {labels[status] || status}
    </span>
  );
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatChartDate(dateStr, period) {
  const d = new Date(dateStr);
  if (period === "day") {
    return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" });
  }
  if (period === "week") {
    return `S${getWeekNumber(d)}`;
  }
  if (period === "month") {
    return d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
  }
  return d.getFullYear().toString();
}

function getWeekNumber(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diff = date - startOfYear;
  return Math.ceil((diff / 86400000 + startOfYear.getDay() + 1) / 7);
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [period, setPeriod] = useState("month");
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [statsData, activityData] = await Promise.all([
        dashboardService.fetchStats(),
        dashboardService.fetchRecentActivity(),
      ]);
      setStats(statsData);
      setActivity(activityData);
    } catch {
      // silent fail for dashboard
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRevenue = useCallback(async (p) => {
    try {
      const data = await dashboardService.fetchRevenue(p);
      setRevenue(data);
    } catch {
      setRevenue([]);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadRevenue(period);
  }, [period, loadRevenue]);

  const CURRENCY_SYMBOL = "€";

  const STAT_CARDS = [
    {
      label: "Factures ce mois",
      icon: Receipt,
      getValue: () => stats?.invoiceCount ?? null,
      getTrend: () => stats?.invoiceTrend ?? null,
    },
    {
      label: "Chiffre d'affaires",
      icon: TrendingUp,
      getValue: () => {
        const v = stats?.revenue;
        return v != null ? `${Number(v).toFixed(0)} ${CURRENCY_SYMBOL}` : null;
      },
      getTrend: () => stats?.revenueTrend ?? null,
    },
    {
      label: "Utilisateurs",
      icon: Users,
      getValue: () => stats?.userCount ?? null,
      getTrend: () => null,
    },
    {
      label: "Dépenses ce mois",
      icon: Package,
      getValue: () => {
        const v = stats?.expenseCount;
        return v != null ? `${v}` : null;
      },
      getTrend: () => stats?.expenseTrend ?? null,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">Dashboard</h1>
          <p className="text-[0.9375rem] text-ink-muted mt-1">
            Vue d'ensemble de votre activité.
          </p>
        </div>
        <span className="text-[0.8125rem] text-ink-muted hidden sm:block">
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, idx) => {
          const Icon = card.icon;
          const trend = card.getTrend();
          const rawValue = loading ? null : card.getValue();
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
                {trend && trend.value && (
                  <div
                    className={`flex items-center gap-1 text-[0.75rem] font-medium ${
                      trend.positive ? "text-success" : "text-error"
                    }`}
                  >
                    {trend.positive ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}
                    {trend.value}
                  </div>
                )}
              </div>
              <div className="mt-3">
                <p className="text-[0.8125rem] text-ink-muted font-medium">{card.label}</p>
                <p className={`text-[1.5rem] font-semibold mt-0.5 ${formatted.muted ? "text-ink-muted" : "text-ink"}`}>
                  {formatted.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[1.125rem] font-medium text-ink">Activité récente</h2>
            <span className="text-[0.8125rem] text-ink-muted">Dernières 24h</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8 text-[0.9375rem] text-ink-muted">
              Chargement...
            </div>
          ) : activity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center mb-3">
                <Clock size={18} className="text-ink-muted" strokeWidth={1.5} />
              </div>
              <p className="text-[0.9375rem] text-ink-secondary">
                Aucune activité récente.
              </p>
              <p className="text-[0.8125rem] text-ink-muted mt-1">
                Créez une facture ou une commande pour voir l'activité ici.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {activity.slice(0, 7).map((item) => (
                <div key={`${item.type}-${item.id}`} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0 ${
                    item.type === "invoice"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-orange-50 text-orange-600"
                  }`}>
                    {item.type === "invoice" ? (
                      <FileText size={15} strokeWidth={2} />
                    ) : (
                      <DollarSign size={15} strokeWidth={2} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.875rem] font-medium text-ink truncate">
                      {item.title}
                    </p>
                    <p className="text-[0.75rem] text-ink-muted truncate">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.status && <StatusBadge status={item.status} />}
                    <span className="text-[0.6875rem] text-ink-muted whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <h2 className="text-[1.125rem] font-medium text-ink mb-3">Actions rapides</h2>
          <div className="flex flex-col gap-2">
            <a
              href="/invoices/new"
              className="flex items-center gap-3 px-4 py-3 rounded-[10px] border border-border bg-surface-raised text-ink-secondary text-[0.9375rem] font-medium hover:border-primary hover:text-primary hover:shadow-ambient transition-all duration-200"
            >
              <Receipt size={18} strokeWidth={2} />
              Nouvelle facture
            </a>
            <a
              href="/quick-invoice"
              className="flex items-center gap-3 px-4 py-3 rounded-[10px] border border-border bg-surface-raised text-ink-secondary text-[0.9375rem] font-medium hover:border-primary hover:text-primary hover:shadow-ambient transition-all duration-200"
            >
              <TrendingUp size={18} strokeWidth={2} />
              Encaissement rapide
            </a>
            <a
              href="/purchase-orders/new"
              className="flex items-center gap-3 px-4 py-3 rounded-[10px] border border-border bg-surface-raised text-ink-secondary text-[0.9375rem] font-medium hover:border-primary hover:text-primary hover:shadow-ambient transition-all duration-200"
            >
              <Package size={18} strokeWidth={2} />
              Nouvelle commande
            </a>
          </div>
        </div>
      </div>

      <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[1.125rem] font-medium text-ink">Chiffre d'affaires</h2>
          <div className="flex gap-1 bg-surface rounded-[10px] p-0.5">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-3 py-1.5 text-[0.8125rem] font-medium rounded-[8px] transition-all ${
                  period === p.key
                    ? "bg-surface-raised text-ink shadow-ambient"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-64">
          {revenue.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <TrendingUp size={24} className="text-ink-muted mb-2" strokeWidth={1.5} />
              <p className="text-[0.9375rem] text-ink-secondary">
                Aucune donnée de revenu pour cette période.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #e5e7eb)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => formatChartDate(d, period)}
                  tick={{ fontSize: 12, fill: "var(--color-ink-muted, #9ca3af)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "var(--color-ink-muted, #9ca3af)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}€`}
                />
                <Tooltip
                  formatter={(value) => [`${Number(value).toFixed(2)} €`, "Revenu"]}
                  labelFormatter={(label) => formatChartDate(label, period)}
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid var(--color-border, #e5e7eb)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    fontSize: "0.875rem",
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill="var(--color-primary, #3b82f6)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
