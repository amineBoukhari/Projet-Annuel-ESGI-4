import { useEffect, useState } from "react";
import { Plus, Eye, Pencil, CheckCircle, XCircle, CreditCard, Filter } from "lucide-react";
import toast from "react-hot-toast";
import invoiceService from "../services/invoiceService";
import Button from "../components/ui/Button";

const STATUS_BADGES = {
  draft: { label: "Brouillon", color: "bg-secondary-muted text-warning" },
  validated: { label: "Validée", color: "bg-blue-50 text-info" },
  paid: { label: "Payée", color: "bg-green-50 text-success" },
  cancelled: { label: "Annulée", color: "bg-red-50 text-error" },
};

const FILTER_LABELS = {
  all: "Toutes",
  draft: "Brouillon",
  validated: "Validée",
  paid: "Payée",
  cancelled: "Annulée",
};

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const data = await invoiceService.fetchInvoices();
      setInvoices(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Impossible de charger les factures");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleValidate = async (id) => {
    try {
      await invoiceService.validateInvoice(id);
      toast.success("Facture validée");
      await loadInvoices();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handlePay = async (id) => {
    try {
      await invoiceService.payInvoice(id, "Cash");
      toast.success("Facture payée");
      await loadInvoices();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Annuler cette facture ?")) return;
    try {
      await invoiceService.cancelInvoice(id);
      toast.success("Facture annulée");
      await loadInvoices();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (filter === "all") return true;
    return inv.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">Factures</h1>
          <p className="text-[0.9375rem] text-ink-muted mt-1">
            Gérez les factures clients.
          </p>
        </div>
        <Button
          text="Nouvelle facture"
          variant="primary"
          icon={Plus}
          onClick={() => window.location.href = "/invoices/new"}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter size={16} className="text-ink-muted mr-1" strokeWidth={2} />
        {Object.keys(FILTER_LABELS).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              px-3.5 py-2 rounded-[10px] text-[0.8125rem] font-medium transition-all duration-150
              ${
                filter === f
                  ? "bg-ink text-white shadow-ambient"
                  : "bg-surface-raised text-ink-secondary hover:bg-surface hover:text-ink border border-border"
              }
            `}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-40 text-ink-muted text-[0.9375rem]">
          Chargement...
        </div>
      ) : (
        <div className="overflow-hidden rounded-[16px] border border-border bg-surface-raised shadow-ambient">
          <div className="overflow-x-auto">
            <table className="min-w-full text-[0.9375rem]">
              <thead className="bg-surface">
                <tr>
                  {["N°", "Client", "Montant", "Statut", "Date", ""].map((header) => (
                    <th
                      key={header}
                      className="px-5 py-3.5 text-left text-[0.75rem] font-semibold text-ink-secondary uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredInvoices.map((invoice) => {
                  const badge = STATUS_BADGES[invoice.status] || STATUS_BADGES.draft;
                  return (
                    <tr
                      key={invoice.id}
                      className="hover:bg-surface transition-colors duration-150"
                    >
                      <td className="px-5 py-4 font-medium text-ink">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-5 py-4 text-ink-secondary">
                        {invoice.customerName}
                      </td>
                      <td className="px-5 py-4 text-ink font-semibold">
                        {parseFloat(invoice.totalAmount).toFixed(2)} €
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.75rem] font-semibold ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-ink-muted text-[0.8125rem]">
                        {new Date(invoice.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`/invoices/${invoice.id}`}
                            className="text-ink-muted hover:text-ink p-2 rounded-[8px] hover:bg-surface transition-all duration-150"
                            title="Voir"
                          >
                            <Eye size={16} strokeWidth={2} />
                          </a>
                          {invoice.status === "draft" && (
                            <a
                              href={`/invoices/edit/${invoice.id}`}
                              className="text-info hover:text-blue-700 p-2 rounded-[8px] hover:bg-blue-50 transition-all duration-150"
                              title="Modifier"
                            >
                              <Pencil size={16} strokeWidth={2} />
                            </a>
                          )}
                          {invoice.status === "draft" && (
                            <button
                              onClick={() => handleValidate(invoice.id)}
                              className="text-success hover:text-green-700 p-2 rounded-[8px] hover:bg-green-50 transition-all duration-150"
                              title="Valider"
                            >
                              <CheckCircle size={16} strokeWidth={2} />
                            </button>
                          )}
                          {invoice.status === "validated" && (
                            <button
                              onClick={() => handlePay(invoice.id)}
                              className="text-success hover:text-green-700 p-2 rounded-[8px] hover:bg-green-50 transition-all duration-150"
                              title="Payer"
                            >
                              <CreditCard size={16} strokeWidth={2} />
                            </button>
                          )}
                          {(invoice.status === "draft" || invoice.status === "validated") && (
                            <button
                              onClick={() => handleCancel(invoice.id)}
                              className="text-error hover:text-red-700 p-2 rounded-[8px] hover:bg-red-50 transition-all duration-150"
                              title="Annuler"
                            >
                              <XCircle size={16} strokeWidth={2} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-ink-muted text-[0.9375rem]">
                      Aucune facture trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
