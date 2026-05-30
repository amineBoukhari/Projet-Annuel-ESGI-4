import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';
import GoodsReceiptService from '../services/goodsReceiptService';
import { Truck, Eye, CheckCircle, AlertCircle, Clock, FileText } from 'lucide-react';

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft':
        return <Clock className="w-4 h-4 text-gray-500" />;
      case 'received':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'partial':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'draft': 'Brouillon',
      'received': 'Complète',
      'partial': 'Partielle',
      'rejected': 'Rejetée',
    };
    return labels[status] || status;
  };

  const filteredReceipts = filter === 'all'
    ? receipts
    : receipts.filter(r => r.status === filter);

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
          <h1 className="text-3xl font-bold text-gray-900">Réceptions</h1>
          <p className="text-gray-500 mt-1">Historique des bons de réception</p>
        </div>
        <button
          onClick={() => navigate('/purchase-orders')}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Truck className="w-4 h-4" />
          Nouvelle réception
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
          { key: 'received', label: 'Complètes' },
          { key: 'partial', label: 'Partielles' },
          { key: 'rejected', label: 'Rejetées' },
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
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Commande liée</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Date réception</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Articles</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Statut</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredReceipts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400">
                  Aucune réception trouvée
                </td>
              </tr>
            ) : (
              filteredReceipts.map((receipt) => (
                <tr key={receipt.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/goods-receipts/${receipt.id}`)}>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    #{receipt.id.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {receipt.purchaseOrderId ? (
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                        PO #{receipt.purchaseOrderId}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">Sans commande</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {receipt.receiptDate ? new Date(receipt.receiptDate).toLocaleDateString('fr-FR') : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {receipt.items?.length || 0} article(s)
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(receipt.status)}
                      <span className="text-sm text-gray-700">{getStatusLabel(receipt.status)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/goods-receipts/${receipt.id}`);
                        }}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {receipt.status === 'received' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/supplier-invoices/new?receiptId=${receipt.id}`);
                          }}
                          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-2 py-1 rounded transition-colors"
                        >
                          <FileText className="w-3 h-3" />
                          Facture
                        </button>
                      )}
                    </div>
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
