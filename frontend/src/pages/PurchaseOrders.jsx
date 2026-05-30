import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';
import PurchaseOrderService from '../services/purchaseOrderService';
import { Truck, Eye, CheckCircle, AlertCircle, Clock, ClipboardList } from 'lucide-react';

export default function PurchaseOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const restaurantId = user?.restaurantId;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await PurchaseOrderService.getAll(restaurantId);
      setOrders(res);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des commandes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurantId) {
      fetchOrders();
    }
  }, [restaurantId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Draft':
        return <Clock className="w-4 h-4 text-gray-500" />;
      case 'Sent':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'Confirmed':
        return <CheckCircle className="w-4 h-4 text-yellow-500" />;
      case 'Received':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Partially Received':
        return <CheckCircle className="w-4 h-4 text-orange-500" />;
      case 'Rejected':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'Draft': 'Brouillon',
      'Sent': 'Envoyée',
      'Confirmed': 'Confirmée',
      'Received': 'Reçue',
      'Partially Received': 'Partiellement reçue',
      'Rejected': 'Rejetée',
    };
    return labels[status] || status;
  };

  const canReceive = (status) => {
    return status === 'Sent' || status === 'Confirmed' || status === 'Partially Received';
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter);

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
          <h1 className="text-3xl font-bold text-gray-900">Commandes fournisseurs</h1>
          <p className="text-gray-500 mt-1">Suivi des commandes et réceptions</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/goods-receipts')}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 transition-colors"
          >
            <Truck className="w-4 h-4" />
            Voir les réceptions
          </button>
          <button
            onClick={() => navigate('/purchase-orders/new')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <ClipboardList className="w-4 h-4" />
            Nouvelle commande
          </button>
        </div>
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
          { key: 'Sent', label: 'Envoyées' },
          { key: 'Confirmed', label: 'Confirmées' },
          { key: 'Partially Received', label: 'Partielles' },
          { key: 'Received', label: 'Reçues' },
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
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Fournisseur</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Date commande</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Livraison attendue</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Statut</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400">
                  Aucune commande trouvée
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    #{order.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    Fournisseur #{order.supplierId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString('fr-FR') : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString('fr-FR') : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(order.status)}
                      <span className="text-sm text-gray-700">{getStatusLabel(order.status)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/purchase-orders/${order.id}`)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {canReceive(order.status) && (
                        <button
                          onClick={() => navigate(`/goods-receipt/new?poId=${order.id}`)}
                          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
                        >
                          <Truck className="w-3 h-3" />
                          Réceptionner
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
