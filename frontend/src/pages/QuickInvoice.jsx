import { useState, useRef } from "react";
import { ArrowLeft, Banknote, CreditCard, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router";
import invoiceService from "../services/invoiceService";
import Button from "../components/ui/Button";
import Input from "../components/form/Input/Input";

export default function QuickInvoice() {
  const navigate = useNavigate();
  const amountRef = useRef();
  const [customerName, setCustomerName] = useState("Client comptoir");
  const [totalAmount, setTotalAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      amountRef.current?.focus();
    } catch (err) {
      toast.error(err.message || "Erreur lors de l'encaissement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-[0.8125rem] font-medium text-ink-muted hover:text-ink mb-6 transition-colors duration-150"
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Retour au Dashboard
      </Link>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-full bg-primary-muted text-primary flex items-center justify-center mx-auto mb-4">
          <Zap size={24} strokeWidth={2} />
        </div>
        <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">Encaissement rapide</h1>
        <p className="text-[0.9375rem] text-ink-muted mt-1">Créez une facture et encaissez en un clic</p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-surface-raised rounded-[16px] border border-border p-6 shadow-ambient"
        noValidate
      >
        {/* Customer name */}
        <div className="mb-5">
          <Input
            label="Nom du client (optionnel)"
            identifier="customerName"
            type="text"
            placeHolder="Client comptoir"
            defaultValue={customerName}
            ref={useRef()}
          />
        </div>

        {/* Total amount */}
        <div className="mb-5">
          <label
            htmlFor="totalAmount"
            className="block text-[0.8125rem] font-medium text-ink-secondary mb-1.5"
          >
            Montant total <span className="text-error">*</span>
          </label>
          <div className="relative">
            <input
              ref={amountRef}
              id="totalAmount"
              name="totalAmount"
              type="number"
              min="0"
              step="0.01"
              required
              autoFocus
              placeholder="0.00"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="
                w-full
                bg-surface-raised
                border border-border
                rounded-[10px]
                px-4 py-3
                text-[1.5rem]
                font-semibold
                text-ink
                placeholder:text-ink-muted
                outline-none
                transition-all duration-200
                hover:border-border-strong
                focus:border-primary
                focus:shadow-lifted
              "
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted font-medium text-[1.125rem]">
              €
            </span>
          </div>
        </div>

        {/* Payment method */}
        <div className="mb-6">
          <span className="block text-[0.8125rem] font-medium text-ink-secondary mb-2">
            Mode de paiement
          </span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod("Cash")}
              className={`flex items-center justify-center gap-2 py-3 rounded-[10px] text-[0.9375rem] font-medium border transition-all duration-200 ${
                paymentMethod === "Cash"
                  ? "bg-primary text-white border-primary shadow-ambient"
                  : "bg-surface-raised text-ink-secondary border-border hover:bg-surface hover:text-ink"
              }`}
            >
              <Banknote size={18} strokeWidth={2} />
              Espèces
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("Card")}
              className={`flex items-center justify-center gap-2 py-3 rounded-[10px] text-[0.9375rem] font-medium border transition-all duration-200 ${
                paymentMethod === "Card"
                  ? "bg-primary text-white border-primary shadow-ambient"
                  : "bg-surface-raised text-ink-secondary border-border hover:bg-surface hover:text-ink"
              }`}
            >
              <CreditCard size={18} strokeWidth={2} />
              Carte
            </button>
          </div>
        </div>

        {/* Submit */}
        <Button
          text={loading ? "Traitement..." : "Créer et encaisser"}
          variant="primary"
          type="submit"
          disabled={loading || !totalAmount}
          className="w-full py-3.5 text-[1.125rem]"
        />
      </form>

      {/* Keyboard hint */}
      <p className="text-center text-[0.75rem] text-ink-muted mt-4">
        Appuyez sur Entrée pour valider
      </p>
    </div>
  );
}
