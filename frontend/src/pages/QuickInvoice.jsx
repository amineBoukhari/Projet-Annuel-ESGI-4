import { useEffect, useState } from "react";
import { ArrowLeft, Banknote, CreditCard, Zap, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router";
import invoiceService from "../services/invoiceService";

export default function QuickInvoice() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const loadPending = async () => {
    setLoading(true);
    try {
      const data = await invoiceService.fetchUnpaidInvoices();
      const pending = Array.isArray(data) ? data.filter((inv) => inv.status === "validated") : [];
      setInvoices(pending);
    } catch {
      toast.error("Impossible de charger les factures en attente");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handlePay = async (id) => {
    setPayingId(id);
    try {
      await invoiceService.payInvoice(id, paymentMethod);
      toast.success("Facture payée");
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    } catch (err) {
      toast.error(err.message || "Erreur lors de l'encaissement");
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-[0.8125rem] font-medium text-ink-muted hover:text-ink mb-6 transition-colors duration-150"
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Retour au Dashboard
      </Link>

      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-full bg-primary-muted text-primary flex items-center justify-center mx-auto mb-4">
          <Zap size={24} strokeWidth={2} />
        </div>
        <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">Encaissement</h1>
        <p className="text-[0.9375rem] text-ink-muted mt-1">Sélectionnez une facture en attente pour encaisser</p>
      </div>

      {/* Payment method selector */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <span className="text-[0.8125rem] font-medium text-ink-secondary">Mode de paiement :</span>
        <div className="flex gap-2">
          <button
            onClick={() => setPaymentMethod("Cash")}
            className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-[0.8125rem] font-medium border transition-all duration-200 ${
              paymentMethod === "Cash"
                ? "bg-primary text-white border-primary shadow-ambient"
                : "bg-surface-raised text-ink-secondary border-border hover:bg-surface hover:text-ink"
            }`}
          >
            <Banknote size={16} strokeWidth={2} />
            Espèces
          </button>
          <button
            onClick={() => setPaymentMethod("Card")}
            className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-[0.8125rem] font-medium border transition-all duration-200 ${
              paymentMethod === "Card"
                ? "bg-primary text-white border-primary shadow-ambient"
                : "bg-surface-raised text-ink-secondary border-border hover:bg-surface hover:text-ink"
            }`}
          >
            <CreditCard size={16} strokeWidth={2} />
            Carte
          </button>
        </div>
      </div>

      {/* Pending invoices list */}
      {loading ? (
        <div className="flex items-center justify-center h-40 text-ink-muted text-[0.9375rem]">
          Chargement...
        </div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-16 bg-surface-raised rounded-[16px] border border-border shadow-ambient">
          <CheckCircle size={48} strokeWidth={1.5} className="mx-auto text-ink-muted mb-4" />
          <p className="text-[0.9375rem] font-medium text-ink">Aucune facture en attente</p>
          <p className="text-[0.8125rem] text-ink-muted mt-1">
            Toutes les factures validées ont été payées.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="bg-surface-raised rounded-[16px] border border-border p-5 shadow-ambient flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="text-[0.75rem] font-semibold text-ink-muted uppercase tracking-wider">
                  {inv.invoiceNumber}
                </p>
                <p className="text-[0.9375rem] font-medium text-ink truncate">
                  {inv.customerName}
                </p>
                <p className="text-[0.8125rem] text-ink-muted">
                  {new Date(inv.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[1.25rem] font-bold text-ink">
                  {parseFloat(inv.totalAmount).toFixed(2)} €
                </p>
                <button
                  onClick={() => handlePay(inv.id)}
                  disabled={payingId === inv.id}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[0.8125rem] font-medium text-white bg-success hover:bg-green-700 transition-colors duration-150 disabled:opacity-50"
                >
                  {payingId === inv.id ? "Traitement..." : "Encaisser"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
