import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';
import GoodsReceiptService from '../services/goodsReceiptService';
import { Truck, Eye, CheckCircle, AlertCircle, Clock, FileText, Plus } from 'lucide-react';
import Button from '../components/ui/Button';

const STATUS_CONFIG = {
  'draft': { icon: Clock, label: 'Brouillon', badge: 'bg-surface text-ink-muted' },
  'received': { icon: CheckCircle, label: 'Complète', badge: 'bg-green-50 text-success' },
  'partial': { icon: AlertCircle, label: 'Partielle', badge: 'bg-secondary-muted text-warning' },
  'rejected': { icon: AlertCircle, label: 'Rejetée', badge: 'bg-red-50 text-error' },
};

export default function GoodsReceipts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const restaurantId = user?.restaurantId;

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const res = await GoodsReceiptService.getAll(restaurantId);
      setReceipts(res);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des réceptions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurantId) {
      fetchReceipts();
    }
  }, [restaurantId]);

  const filteredReceipts = filter === 'all'
    ? receipts
    : receipts.filter(r => r.status === filter);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface rounded w-1/3"></div>
          <div className="h-64 bg-surface rounded-[16px]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">Réceptions</h1>
          <p className="text-[0.9375rem] text-ink-muted mt-1">Historique des bons de réception</p>
        </div>
        <Button
          text="Nouvelle réception"
          variant="primary"
          icon={Plus}
          onClick={() => navigate('/purchase-orders')}
        />
      </div>

      {error && (
        <div className="rounded-[10px] bg-red-50 border border-red-100 text-error px-4 py-3 text-[0.9375rem] font-medium">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: 'Toutes' },
          { key: 'received', label: 'Complètes' },
          { key: 'partial', label: 'Partielles' },
          { key: 'rejected', label: 'Rejetées' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3.5 py-2 rounded-[10px] text-[0.8125rem] font-medium transition-all duration-150 ${
              filter === f.key
                ? 'bg-ink text-white shadow-ambient'
                : 'bg-surface-raised text-ink-secondary hover:bg-surface hover:text-ink border border-border'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-[16px] border border-border bg-surface-raised shadow-ambient">
        <div className="overflow-x-auto">
          <table className="w-full text-[0.9375rem]">
            <thead className="bg-surface">
              <tr>
                {['N°', 'Commande liée', 'Date réception', 'Articles', 'Statut', ''].map((header) => (
                  <th key={header} className="text-left text-[0.75rem] font-semibold text-ink-secondary uppercase tracking-wider px-5 py-3.5">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredReceipts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-ink-muted text-[0.9375rem]">
                    Aucune réception trouvée
                  </td>
                </tr>
              ) : (
                filteredReceipts.map((receipt) => {
                  const status = STATUS_CONFIG[receipt.status] || STATUS_CONFIG['draft'];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={receipt.id} className="hover:bg-surface transition-colors duration-150 cursor-pointer" onClick={() => navigate(`/goods-receipts/${receipt.id}`)}>
                      <td className="px-5 py-4 font-medium text-ink">
                        #{receipt.id.slice(0, 8)}...
                      </td>
                      <td className="px-5 py-4">
                        {receipt.purchaseOrderId ? (
                          <span className="inline-flex items-center gap-1 bg-blue-50 text-info px-2.5 py-1 rounded-full text-[0.75rem] font-semibold">
                            PO #{receipt.purchaseOrderId}
                          </span>
                        ) : (
                          <span className="text-ink-muted text-[0.8125rem]">Sans commande</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-ink-secondary">
                        {receipt.receiptDate ? new Date(receipt.receiptDate).toLocaleDateString('fr-FR') : '-'}
                      </td>
                      <td className="px-5 py-4 text-ink-secondary">
                        {receipt.items?.length || 0} article(s)
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.75rem] font-semibold ${status.badge}`}>
                          <StatusIcon size={12} strokeWidth={2} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/goods-receipts/${receipt.id}`);
                            }}
                            className="text-ink-muted hover:text-ink p-2 rounded-[8px] hover:bg-surface transition-all duration-150"
                            title="Voir détails"
                          >
                            <Eye size={16} strokeWidth={2} />
                          </button>
                          {receipt.status === 'received' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/supplier-invoices/new?receiptId=${receipt.id}`);
                              }}
                              className="flex items-center gap-1 bg-info hover:bg-blue-700 text-white text-[0.75rem] font-medium px-3 py-1.5 rounded-[8px] transition-all duration-150"
                            >
                              <FileText size={12} strokeWidth={2} />
                              Facture
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
