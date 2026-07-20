import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { formatChartDate } from "../../../utils/formatters";

const PERIODS = [
  { key: "day", label: "Jour" },
  { key: "week", label: "Semaine" },
  { key: "month", label: "Mois" },
  { key: "year", label: "Année" },
];

export default function RevenueChart({ revenue, period, onPeriodChange }) {
  return (
    <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[1.125rem] font-medium text-ink">
          Chiffre d'affaires
        </h2>
        <div className="flex gap-1 bg-surface rounded-md p-0.5">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => onPeriodChange(p.key)}
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
            <TrendingUp
              size={24}
              className="text-ink-muted mb-2"
              strokeWidth={1.5}
            />
            <p className="text-[0.9375rem] text-ink-secondary">
              Aucune donnée de revenu pour cette période.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={revenue}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border, #e5e7eb)"
                vertical={false}
              />
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
                formatter={(value) => [
                  `${Number(value).toFixed(2)} €`,
                  "Revenu",
                ]}
                labelFormatter={(label) => formatChartDate(label, period)}
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid var(--color-border, #e5e7eb)",
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
  );
}
