import { useState } from "react";
import { ArrowLeft, Banknote, CreditCard, Receipt } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import invoiceService from "../services/invoiceService";

export default function QuickInvoice() {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("Client comptoir");
  const [totalAmount, setTotalAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!totalAmount || parseFloat(totalAmount) <= 0) {
      toast.error("Le montant total est requis");
      return;
    }

    setLoading(true);
    try {
      await invoiceService.quickCreateInvoice({
        customerName,
        totalAmount: parseFloat(totalAmount),
        paymentMethod,
      });
      toast.success("Facture créée et payée !");
      setTotalAmount("");
      setCustomerName("Client comptoir");
    } catch (err) {
      toast.error(err.message || "Erreur lors de l'encaissement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} />
        Retour
      </button>

      <div className="text-center mb-8">
        <Receipt size={40} className="mx-auto text-primary mb-2" />
        <h1 className="text-2xl font-bold text-gray-900">Encaissement rapide</h1>
        <p className="text-sm text-gray-500">Créez une facture et encaissez en un clic</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        {/* Customer name */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Nom du client (optionnel)
          </label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Client comptoir"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        {/* Total amount */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Montant total *
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full border border-gray-200 rounded-xl px-3 py-3 text-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="0.00"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              autoFocus
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
              €
            </span>
          </div>
        </div>

        {/* Payment method */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Mode de paiement
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("Cash")}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border transition-colors ${
                paymentMethod === "Cash"
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Banknote size={18} />
              Espèces
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("Card")}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border transition-colors ${
                paymentMethod === "Card"
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <CreditCard size={18} />
              Carte
            </button>
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !totalAmount}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-lg font-bold text-white bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Traitement..." : "Créer et encaisser"}
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-xs text-gray-400 mt-4">
        Appuyez sur Entrée pour valider
      </p>
    </div>
  );
}
