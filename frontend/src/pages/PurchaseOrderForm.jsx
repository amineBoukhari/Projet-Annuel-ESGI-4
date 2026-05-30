import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';
import PurchaseOrderService from '../services/purchaseOrderService';
import SupplierService from '../services/supplierService';
import IngredientService from '../services/ingredientService';
import { ClipboardList, Save, AlertCircle, ChevronLeft, Plus, Trash2 } from 'lucide-react';

export default function PurchaseOrderForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [supplierId, setSupplierId] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const restaurantId = user?.restaurantId;

  // Load suppliers and ingredients on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [suppliersRes, ingredientsRes] = await Promise.all([
          SupplierService.getAll(),
          IngredientService.getAll(),
        ]);
        setSuppliers(suppliersRes);
        setIngredients(ingredientsRes);
        if (suppliersRes.length > 0) {
          setSupplierId(String(suppliersRes[0].id));
        }
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const addItem = () => {
    setItems([...items, { ingredientId: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const calculateTotals = () => {
    let subtotal = 0;
    items.forEach((item) => {
      subtotal += (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
    });
    const tax = subtotal * 0.20;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  const handleSave = async () => {
    if (!restaurantId) {
      setError('Restaurant ID manquant');
      return;
    }
    if (!supplierId) {
      setError('Veuillez sélectionner un fournisseur');
      return;
    }
    if (items.length === 0 || items.some((i) => !i.ingredientId || !i.quantity)) {
      setError('Veuillez remplir tous les articles');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const payload = {
        supplierId: parseInt(supplierId),
        restaurantId,
        orderDate,
        expectedDeliveryDate: expectedDeliveryDate || null,
        notes,
        items: items.map((item) => ({
          ingredientId: parseInt(item.ingredientId),
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice) || 0,
        })),
      };

      await PurchaseOrderService.create(payload);
      navigate('/purchase-orders');
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de la commande');
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
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-xl">
            <ClipboardList className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nouvelle commande fournisseur</h1>
            <p className="text-gray-500 text-sm">Créer une commande et envoyer au fournisseur</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Order Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fournisseur *
            </label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choisir un fournisseur</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.companyName ? `(${s.companyName})` : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de commande *
            </label>
            <input
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Livraison attendue
            </label>
            <input
              type="date"
              value={expectedDeliveryDate}
              onChange={(e) => setExpectedDeliveryDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Articles à commander
          </h2>
          <button
            onClick={addItem}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>

        <div className="p-6 space-y-4">
          {items.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              Aucun article. Cliquez sur "Ajouter" pour commencer.
            </p>
          )}
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Ingrédient</label>
                  <select
                    value={item.ingredientId}
                    onChange={(e) => updateItem(index, 'ingredientId', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choisir un ingrédient</option>
                    {ingredients.map((ing) => (
                      <option key={ing.id} value={ing.id}>
                        {ing.name} ({ing.unit})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Quantité</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Prix unit. (€)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={() => removeItem(index)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors mt-5"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Sous-total HT</span>
          <span className="font-medium">{subtotal.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">TVA (20%)</span>
          <span className="font-medium">{tax.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
          <span>Total TTC</span>
          <span>{total.toFixed(2)} €</span>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Commentaires..."
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Enregistrement...' : 'Créer la commande'}
        </button>
      </div>
    </div>
  );
}
