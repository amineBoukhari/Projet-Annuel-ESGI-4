import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';
import SupplierInvoiceService from '../services/supplierInvoiceService';
import { FileText, Eye, Plus, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import Button from '../components/ui/Button';

const STATUS_CONFIG = {
  'draft': { icon: Clock, label: 'Brouillon', badge: 'bg-surface text-ink-muted' },
  'validated': { icon: CheckCircle, label: 'Validée', badge: 'bg-blue-50 text-info' },
  'paid': { icon: CheckCircle, label: 'Payée', badge: 'bg-green-50 text-success' },
  'overdue': { icon: AlertCircle, label: 'En retard', badge: 'bg-red-50 text-error' },
};

export default function SupplierInvoices() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const restaurantId = user?.restaurantId;

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await SupplierInvoiceService.getAll(restaurantId);
      setInvoices(res);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des factures fournisseurs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurantId) {
      fetchInvoices();
    }
  }, [restaurantId]);

  const filteredInvoices = filter === 'all'
    ? invoices
    : invoices.filter(i => i.status === filter);

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
          <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">Factures fournisseurs</h1>
          <p className="text-[0.9375rem] text-ink-muted mt-1">Suivi des achats et paiements</p>
        </div>
        <Button
          text="Nouvelle facture"
          variant="primary"
          icon={Plus}
          onClick={() => navigate('/supplier-invoices/new')}
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
          { key: 'draft', label: 'Brouillons' },
          { key: 'validated', label: 'Validées' },
          { key: 'paid', label: 'Payées' },
          { key: 'overdue', label: 'En retard' },
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
                {['N°', 'N° fournisseur', 'Fournisseur', 'Date', 'Total TTC', 'Statut', ''].map((header) => (
                  <th key={header} className="text-left text-[0.75rem] font-semibold text-ink-secondary uppercase tracking-wider px-5 py-3.5">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-ink-muted text-[0.9375rem]">
                    Aucune facture fournisseur trouvée
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => {
                  const status = STATUS_CONFIG[invoice.status] || STATUS_CONFIG['draft'];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={invoice.id} className="hover:bg-surface transition-colors duration-150 cursor-pointer" onClick={() => navigate(`/supplier-invoices/${invoice.id}`)}>
                      <td className="px-5 py-4 font-medium text-ink">
                        #{invoice.id.slice(0, 8)}...
                      </td>
                      <td className="px-5 py-4 text-ink-secondary">
                        {invoice.invoiceNumber || '-'}
                      </td>
                      <td className="px-5 py-4 text-ink-secondary">
                        Fournisseur #{invoice.supplierId}
                      </td>
                      <td className="px-5 py-4 text-ink-secondary">
                        {invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString('fr-FR') : '-'}
                      </td>
                      <td className="px-5 py-4 font-semibold text-ink">
                        {invoice.total?.toFixed(2)} €
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.75rem] font-semibold ${status.badge}`}>
                          <StatusIcon size={12} strokeWidth={2} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/supplier-invoices/${invoice.id}`);
                          }}
                          className="text-ink-muted hover:text-ink p-2 rounded-[8px] hover:bg-surface transition-all duration-150"
                          title="Voir détails"
                        >
                          <Eye size={16} strokeWidth={2} />
                        </button>
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
