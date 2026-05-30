import { useEffect, useState } from "react";
import { X, Plus, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import invoiceService from "../services/invoiceService";

export default function InvoiceForm() {
  const navigate = useNavigate();
  const params = useParams();
  const editId = params.id; // present if URL is /invoices/edit/:id
  const isEditMode = !!editId;

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [items, setItems] = useState([
    { description: "", quantity: 1, unitPrice: "" },
  ]);
  const [invoiceStatus, setInvoiceStatus] = useState("draft");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);

  // Load invoice data if in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const loadInvoice = async () => {
      try {
        const data = await invoiceService.fetchInvoiceById(editId);
        setCustomerName(data.customerName || "");
        setCustomerEmail(data.customerEmail || "");
        setInvoiceStatus(data.status || "draft");

        if (data.items && data.items.length > 0) {
          setItems(
            data.items.map((item) => ({
              description: item.description || "",
              quantity: item.quantity || 1,
              unitPrice: String(item.unitPrice || ""),
            })),
          );
        }
      } catch {
        toast.error("Impossible de charger la facture");
        navigate("/invoices");
      } finally {
        setPageLoading(false);
      }
    };

    loadInvoice();
  }, [editId, isEditMode, navigate]);

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: "" }]);
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
      const qty = parseInt(item.quantity, 10) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      subtotal += qty * price;
    });
    const tax = subtotal * 0.2; // 20% VAT
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleSubmit = async (validateImmediately) => {
    if (!customerName.trim()) {
      toast.error("Le nom du client est requis");
      return;
    }

    const validItems = items.filter(
      (item) => item.description.trim() && parseFloat(item.unitPrice) > 0,
    );

    if (validItems.length === 0) {
      toast.error("Au moins un article valide est requis");
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        // Update existing draft
        if (invoiceStatus !== "draft") {
          toast.error("Seuls les brouillons peuvent être modifiés");
          setLoading(false);
          return;
        }

        await invoiceService.updateInvoice(editId, {
          customerName,
          customerEmail,
          items: validItems,
        });

        if (validateImmediately) {
          await invoiceService.validateInvoice(editId);
          toast.success("Facture mise à jour et validée");
        } else {
          toast.success("Brouillon mis à jour");
        }
      } else {
        // Create new invoice
        const result = await invoiceService.createInvoice({
          customerName,
          customerEmail,
          items: validItems,
        });

        const invoiceId = result.invoice?.id;

        if (validateImmediately && invoiceId) {
          await invoiceService.validateInvoice(invoiceId);
          toast.success("Facture créée et validée");
        } else {
          toast.success("Brouillon enregistré");
        }
      }

      navigate("/invoices");
    } catch (err) {
      toast.error(err.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, tax, total } = calculateTotals();

  if (pageLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-40 text-gray-400">
        Chargement...
      </div>
    );
  }

  // If editing a non-draft, show error and redirect
  if (isEditMode && invoiceStatus !== "draft") {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/invoices")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft size={16} />
          Retour aux factures
        </button>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <p className="text-red-700 font-medium">
            Cette facture ne peut pas être modifiée (statut : {invoiceStatus})
          </p>
          <p className="text-red-600 text-sm mt-1">
            Seuls les brouillons sont modifiables.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate("/invoices")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} />
        Retour aux factures
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditMode ? "Modifier le brouillon" : "Nouvelle facture"}
      </h1>

      {/* Customer info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase">
          Client
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Nom *
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Jean Dupont"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="jean@example.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Line items */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase">
          Articles
        </h2>

        {items.map((item, index) => (
          <div key={index} className="flex gap-2 mb-3 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Description
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Steak frites"
                value={item.description}
                onChange={(e) => updateItem(index, "description", e.target.value)}
              />
            </div>
            <div className="w-24">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Qté
              </label>
              <input
                type="number"
                min="1"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", e.target.value)}
              />
            </div>
            <div className="w-32">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Prix unit.
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="0.00"
                value={item.unitPrice}
                onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
              />
            </div>
            <button
              onClick={() => removeItem(index)}
              className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
              title="Supprimer"
            >
              <X size={18} />
            </button>
          </div>
        ))}

        <button
          onClick={addItem}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium mt-2"
        >
          <Plus size={16} />
          Ajouter un article
        </button>
      </div>

      {/* Totals */}
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Sous-total</span>
          <span className="font-medium">{subtotal.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">TVA (20%)</span>
          <span className="font-medium">{tax.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
          <span>Total</span>
          <span>{total.toFixed(2)} €</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => navigate("/invoices")}
          className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          Annuler
        </button>
        <button
          onClick={() => handleSubmit(false)}
          disabled={loading}
          className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          {loading
            ? "Enregistrement..."
            : isEditMode
              ? "Enregistrer modifications"
              : "Enregistrer brouillon"}
        </button>
        <button
          onClick={() => handleSubmit(true)}
          disabled={loading}
          className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50"
        >
          {loading
            ? "Validation..."
            : isEditMode
              ? "Valider la facture"
              : "Valider la facture"}
        </button>
      </div>
    </div>
  );
}
