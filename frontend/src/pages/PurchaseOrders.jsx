import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';
import PurchaseOrderService from '../services/purchaseOrderService';
import { Truck, Eye, CheckCircle, AlertCircle, Clock, ClipboardList, Plus } from 'lucide-react';
import Button from '../components/ui/Button';

const STATUS_CONFIG = {
  'Draft': { icon: Clock, color: 'text-ink-muted', label: 'Brouillon', badge: 'bg-surface text-ink-muted' },
  'Sent': { icon: AlertCircle, color: 'text-info', label: 'Envoyée', badge: 'bg-blue-50 text-info' },
  'Confirmed': { icon: CheckCircle, color: 'text-warning', label: 'Confirmée', badge: 'bg-secondary-muted text-warning' },
  'Received': { icon: CheckCircle, color: 'text-success', label: 'Reçue', badge: 'bg-green-50 text-success' },
  'Partially Received': { icon: AlertCircle, color: 'text-warning', label: 'Partielle', badge: 'bg-secondary-muted text-warning' },
  'Rejected': { icon: AlertCircle, color: 'text-error', label: 'Rejetée', badge: 'bg-red-50 text-error' },
};

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

  const canReceive = (status) => {
    return status === 'Sent' || status === 'Confirmed' || status === 'Partially Received';
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter);

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
          <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">Commandes fournisseurs</h1>
          <p className="text-[0.9375rem] text-ink-muted mt-1">Suivi des commandes et réceptions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            text="Voir les réceptions"
            variant="ghost"
            icon={Truck}
            onClick={() => navigate('/goods-receipts')}
          />
          <Button
            text="Nouvelle commande"
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/purchase-orders/new')}
          />
        </div>
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
          { key: 'Sent', label: 'Envoyées' },
          { key: 'Confirmed', label: 'Confirmées' },
          { key: 'Partially Received', label: 'Partielles' },
          { key: 'Received', label: 'Reçues' },
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
                {['N°', 'Fournisseur', 'Date commande', 'Livraison', 'Statut', ''].map((header) => (
                  <th key={header} className="text-left text-[0.75rem] font-semibold text-ink-secondary uppercase tracking-wider px-5 py-3.5">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-ink-muted text-[0.9375rem]">
                    Aucune commande trouvée
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG['Draft'];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={order.id} className="hover:bg-surface transition-colors duration-150">
                      <td className="px-5 py-4 font-medium text-ink">
                        #{order.id}
                      </td>
                      <td className="px-5 py-4 text-ink-secondary">
                        Fournisseur #{order.supplierId}
                      </td>
                      <td className="px-5 py-4 text-ink-secondary">
                        {order.orderDate ? new Date(order.orderDate).toLocaleDateString('fr-FR') : '-'}
                      </td>
                      <td className="px-5 py-4 text-ink-secondary">
                        {order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString('fr-FR') : '-'}
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
                            onClick={() => navigate(`/purchase-orders/${order.id}`)}
                            className="text-ink-muted hover:text-ink p-2 rounded-[8px] hover:bg-surface transition-all duration-150"
                            title="Voir détails"
                          >
                            <Eye size={16} strokeWidth={2} />
                          </button>
                          {canReceive(order.status) && (
                            <button
                              onClick={() => navigate(`/goods-receipt/new?poId=${order.id}`)}
                              className="flex items-center gap-1 bg-success hover:bg-green-700 text-white text-[0.75rem] font-medium px-3 py-1.5 rounded-[8px] transition-all duration-150"
                            >
                              <Truck size={12} strokeWidth={2} />
                              Réceptionner
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
