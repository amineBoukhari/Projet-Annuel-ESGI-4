import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';
import PurchaseOrderService from '../services/purchaseOrderService';
import GoodsReceiptService from '../services/goodsReceiptService';
import { Truck, Save, AlertCircle, ChevronLeft, Package } from 'lucide-react';

export default function GoodsReceipt() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const poId = searchParams.get('poId');

  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const restaurantId = user?.restaurantId;

  // Load the PO data
  useEffect(() => {
    if (!poId) {
      setError('Aucune commande sélectionnée');
      setLoading(false);
      return;
    }

    const loadPO = async () => {
      try {
        const res = await PurchaseOrderService.getById(poId);
        setPurchaseOrder(res);

        // Pre-fill items from PO
        if (res.items) {
          setItems(
            res.items.map((item) => ({
              ingredientId: item.ingredientId,
              ingredientName: item.ingredient?.name || `Ingrédient #${item.ingredientId}`,
              unit: item.ingredient?.unit || 'unité',
              expectedQuantity: item.quantity,
              receivedQuantity: item.quantity, // default to expected
              unitPrice: item.unitPrice || 0,
              notes: '',
              expirationDate: '',
            }))
          );
        }
      } catch (err) {
        setError('Erreur lors du chargement de la commande');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPO();
  }, [poId]);

  const updateItemQuantity = (index, value) => {
    const newItems = [...items];
    newItems[index].receivedQuantity = parseFloat(value) || 0;
    setItems(newItems);
  };

  const updateItemNotes = (index, value) => {
    const newItems = [...items];
    newItems[index].notes = value;
    setItems(newItems);
  };

  const updateItemExpirationDate = (index, value) => {
    const newItems = [...items];
    newItems[index].expirationDate = value;
    setItems(newItems);
  };

  const handleSave = async () => {
    if (!restaurantId) {
      setError('Restaurant ID manquant');
      return;
    }
    if (!purchaseOrder) {
      setError('Commande fournisseur non chargée');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const payload = {
        purchaseOrderId: parseInt(poId),
        supplierId: purchaseOrder.supplierId,
        restaurantId,
        notes,
        items: items.map((item) => ({
          ingredientId: item.ingredientId,
          expectedQuantity: item.expectedQuantity,
          receivedQuantity: item.receivedQuantity,
          unitPrice: item.unitPrice,
          notes: item.notes,
          expirationDate: item.expirationDate || null,
        })),
      };

      const res = await GoodsReceiptService.create(payload);
      const receiptId = res.id;

      // Validate immediately (update stock)
      await GoodsReceiptService.validate(receiptId);

      navigate('/goods-receipts');
    } catch (err) {
      setError('Erreur lors de la réception');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

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

  if (!poId) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Aucune commande fournisseur sélectionnée. Veuillez choisir une commande à réceptionner.
        </div>
        <button
          onClick={() => navigate('/purchase-orders')}
          className="mt-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour aux commandes
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/purchase-orders')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour aux commandes
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-xl">
              <Truck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Réception de livraison</h1>
              <p className="text-gray-500 text-sm">
                Commande #{poId} — Fournisseur #{purchaseOrder?.supplierId}
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Items Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Articles reçus
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Article</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Attendu</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Reçu</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Prix unit.</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Péremption</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item, index) => (
                <tr key={item.ingredientId}>
                  <td className="px-6 py-3">
                    <span className="text-sm font-medium text-gray-900">{item.ingredientName}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-sm text-gray-500">{item.expectedQuantity} {item.unit}</span>
                  </td>
                  <td className="px-6 py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.receivedQuantity}
                      onChange={(e) => updateItemQuantity(index, e.target.value)}
                      className={`w-24 px-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        item.receivedQuantity < item.expectedQuantity
                          ? 'border-orange-300 bg-orange-50'
                          : 'border-gray-300'
                      }`}
                    />
                    {item.receivedQuantity < item.expectedQuantity && (
                      <span className="text-xs text-orange-600 ml-2">Partiel</span>
                    )}
                    {item.receivedQuantity > item.expectedQuantity && (
                      <span className="text-xs text-blue-600 ml-2">Excès</span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-sm text-gray-500">{item.unitPrice.toFixed(2)} €</span>
                  </td>
                  <td className="px-6 py-3">
                    <input
                      type="date"
                      value={item.expirationDate}
                      onChange={(e) => updateItemExpirationDate(index, e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input
                      type="text"
                      placeholder="Ex: produit endommagé..."
                      value={item.notes}
                      onChange={(e) => updateItemNotes(index, e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes générales
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Commentaires sur la livraison..."
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => navigate('/purchase-orders')}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Validation...' : 'Valider la réception'}
        </button>
      </div>
    </div>
  );
}
