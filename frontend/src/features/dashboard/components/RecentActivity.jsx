import { Clock, FileText, DollarSign } from "lucide-react";
import StatusBadge from "../../../components/ui/StatusBadge";
import { formatDate } from "../../../utils/formatters";

export default function RecentActivity({ activity, loading }) {
  return (
    <div className="lg:col-span-2 bg-surface-raised rounded-[16px] p-5 shadow-ambient">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[1.125rem] font-medium text-ink">
          Activité récente
        </h2>
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
        </div>
      ) : (
        <div className="divide-y divide-border">
          {activity.slice(0, 7).map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div
                className={`w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 ${
                  item.type === "invoice"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-orange-50 text-orange-600"
                }`}
              >
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
              <div className="flex items-center gap-2 shrink-0">
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
  );
}
