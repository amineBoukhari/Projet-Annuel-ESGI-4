import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';
import SupplierInvoiceService from '../services/supplierInvoiceService';
import { FileText, Eye, Plus, CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft':
        return <Clock className="w-4 h-4 text-gray-500" />;
      case 'validated':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'draft': 'Brouillon',
      'validated': 'Validée',
      'paid': 'Payée',
      'overdue': 'En retard',
    };
    return labels[status] || status;
  };

  const filteredInvoices = filter === 'all'
    ? invoices
    : invoices.filter(i => i.status === filter);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Factures fournisseurs</h1>
          <p className="text-gray-500 mt-1">Suivi des achats et paiements</p>
        </div>
        <button
          onClick={() => navigate('/supplier-invoices/new')}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvelle facture
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6">
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
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f.key
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">N°</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">N° facture fournisseur</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Fournisseur</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Date</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Total TTC</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Statut</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400">
                  Aucune facture fournisseur trouvée
                </td>
              </tr>
            ) : (
              filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/supplier-invoices/${invoice.id}`)}>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    #{invoice.id.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {invoice.invoiceNumber || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    Fournisseur #{invoice.supplierId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString('fr-FR') : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    {invoice.total?.toFixed(2)} €
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(invoice.status)}
                      <span className="text-sm text-gray-700">{getStatusLabel(invoice.status)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/supplier-invoices/${invoice.id}`);
                      }}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="Voir détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
