import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';
import SupplierInvoiceService from '../services/supplierInvoiceService';
import GoodsReceiptService from '../services/goodsReceiptService';
import { FileText, Save, AlertCircle, ChevronLeft, Plus, Trash2 } from 'lucide-react';

export default function SupplierInvoiceForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const receiptId = searchParams.get('receiptId');

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([]);
  const [linkedReceipt, setLinkedReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const restaurantId = user?.restaurantId;

  // If receiptId is provided, pre-fill from goods receipt
  useEffect(() => {
    if (receiptId) {
      const loadReceipt = async () => {
        try {
          setLoading(true);
          const res = await GoodsReceiptService.getById(receiptId);
          setLinkedReceipt(res);

          // Pre-fill items from receipt
          if (res.items) {
            setItems(
              res.items.map((item) => ({
                ingredientId: item.ingredientId,
                description: item.ingredient?.name || `Article #${item.ingredientId}`,
                quantity: item.receivedQuantity,
                unitPrice: item.unitPrice,
              }))
            );
          }
        } catch (err) {
          setError('Erreur lors du chargement de la réception');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      loadReceipt();
    } else {
      setLoading(false);
      // Start with one empty line
      setItems([{ ingredientId: null, description: '', quantity: 1, unitPrice: 0 }]);
    }
  }, [receiptId]);

  const addItem = () => {
    setItems([...items, { ingredientId: null, description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const calculateTotals = () => {
    let subtotal = 0;
    items.forEach((item) => {
      subtotal += item.quantity * item.unitPrice;
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
    if (items.length === 0 || items.some((i) => !i.description)) {
      setError('Veuillez remplir tous les articles');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const payload = {
        goodsReceiptId: receiptId || null,
        supplierId: linkedReceipt?.supplierId || 1, // fallback if no receipt
        restaurantId,
        invoiceNumber,
        invoiceDate,
        dueDate: dueDate || null,
        notes,
        items: items.map((item) => ({
          ingredientId: item.ingredientId,
          description: item.description,
          quantity: parseFloat(item.quantity) || 0,
          unitPrice: parseFloat(item.unitPrice) || 0,
        })),
      };

      await SupplierInvoiceService.create(payload);
      navigate('/supplier-invoices');
    } catch (err) {
      setError('Erreur lors de la création de la facture');
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
          onClick={() => navigate('/supplier-invoices')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour aux factures
        </button>
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-xl">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nouvelle facture fournisseur</h1>
            {receiptId && linkedReceipt && (
              <p className="text-gray-500 text-sm">
                Liée à la réception #{receiptId.slice(0, 8)}...
              </p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Invoice Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              N° facture fournisseur
            </label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="Ex: FAC-2026-001"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de facture
            </label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date d'échéance
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Articles
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
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                />
                <div className="flex gap-3">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Qté"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Prix unit."
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                    className="w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="flex items-center text-sm text-gray-600">
                    = {(item.quantity * item.unitPrice).toFixed(2)} €
                  </span>
                </div>
              </div>
              <button
                onClick={() => removeItem(index)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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
          onClick={() => navigate('/supplier-invoices')}
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
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
