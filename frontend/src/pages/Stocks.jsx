import { Package, AlertTriangle, TrendingUp, Box } from "lucide-react";

export default function Stocks() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">Stocks</h1>
        <p className="text-[0.9375rem] text-ink-muted mt-1">
          Suivez vos niveaux de stock et vos mouvements d'inventaire.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center">
              <Package size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">Articles en stock</span>
          </div>
          <p className="text-[1.5rem] font-semibold text-ink-muted">—</p>
        </div>
        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center">
              <AlertTriangle size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">Alertes</span>
          </div>
          <p className="text-[1.5rem] font-semibold text-ink-muted">—</p>
        </div>
        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center">
              <TrendingUp size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">Valeur totale</span>
          </div>
          <p className="text-[1.5rem] font-semibold text-ink-muted">—</p>
        </div>
        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center">
              <Box size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">Catégories</span>
          </div>
          <p className="text-[1.5rem] font-semibold text-ink-muted">—</p>
        </div>
      </div>

      <div className="bg-surface-raised rounded-[16px] p-8 shadow-ambient flex flex-col items-center justify-center text-center py-12">
        <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center mb-3">
          <Package size={18} className="text-ink-muted" strokeWidth={1.5} />
        </div>
        <h2 className="text-[1.125rem] font-medium text-ink">Gestion des stocks</h2>
        <p className="text-[0.9375rem] text-ink-secondary mt-1">
          Le module de gestion des stocks est en cours de développement.
        </p>
      </div>
    </div>
  );
}
