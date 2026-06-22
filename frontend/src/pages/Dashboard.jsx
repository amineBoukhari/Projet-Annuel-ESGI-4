import { useEffect, useState } from "react";
import {
  Receipt,
  TrendingUp,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertTriangle,
} from "lucide-react";
import invoiceService from "../services/invoiceService";

const STAT_CARDS = [
  {
    label: "Factures ce mois",
    icon: Receipt,
    getValue: (data) => data.invoiceCount || 0,
    getTrend: () => ({ value: "+12%", positive: true }),
  },
  {
    label: "Chiffre d'affaires",
    icon: TrendingUp,
    getValue: (data) => `${(data.totalRevenue || 0).toFixed(0)} €`,
    getTrend: () => ({ value: "+8%", positive: true }),
  },
  {
    label: "Utilisateurs",
    icon: Users,
    getValue: () => null,
    getTrend: () => null,
  },
  {
    label: "Stocks",
    icon: Package,
    getValue: () => null,
    getTrend: () => null,
  },
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

export default function Dashboard() {
  const [stats, setStats] = useState({ invoiceCount: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const invoices = await invoiceService.fetchInvoices();
        const count = Array.isArray(invoices) ? invoices.length : 0;
        const revenue = Array.isArray(invoices)
          ? invoices.reduce((sum, inv) => sum + (parseFloat(inv.totalAmount) || 0), 0)
          : 0;
        setStats({ invoiceCount: count, totalRevenue: revenue });
      } catch {
        // silent fail for dashboard
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Heading */}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, idx) => {
          const Icon = card.icon;
          const trend = card.getTrend();
          const rawValue = loading ? null : card.getValue(stats);
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
                {trend && (
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

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[1.125rem] font-medium text-ink">Activité récente</h2>
            <span className="text-[0.8125rem] text-ink-muted">Dernières 24h</span>
          </div>
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
        </div>

        {/* Quick Actions */}
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
            <a
              href="/stocks/expiring-ingredients"
              className="flex items-center gap-3 px-4 py-3 rounded-[10px] border border-border bg-surface-raised text-ink-secondary text-[0.9375rem] font-medium hover:border-warning hover:text-warning hover:shadow-ambient transition-all duration-200"
            >
              <AlertTriangle size={18} strokeWidth={2} />
              Alertes de péremption
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
