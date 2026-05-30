import { useEffect, useState } from "react";
import { Plus, Eye, Pencil, CheckCircle, XCircle, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import invoiceService from "../services/invoiceService";

const STATUS_BADGES = {
  draft: { label: "Brouillon", className: "bg-gray-100 text-gray-700" },
  validated: { label: "Validée", className: "bg-blue-100 text-blue-700" },
  paid: { label: "Payée", className: "bg-green-100 text-green-700" },
  cancelled: { label: "Annulée", className: "bg-red-100 text-red-700" },
};

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const data = await invoiceService.fetchInvoices();
      if (Array.isArray(data)) {
        setInvoices(data);
      } else {
        setInvoices([]);
      }
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Factures</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez les factures clients.
          </p>
        </div>
        <a
          href="/invoices/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90"
        >
          <Plus size={16} />
          Nouvelle facture
        </a>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {["all", "draft", "validated", "paid", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${
              filter === f
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f === "all" ? "Toutes" : STATUS_BADGES[f]?.label || f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
          Chargement...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">N°</th>
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Montant</th>
                <th className="px-4 py-3 text-left">Statut</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvoices.map((invoice) => {
                const badge = STATUS_BADGES[invoice.status] || STATUS_BADGES.draft;
                return (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {invoice.customerName}
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {parseFloat(invoice.totalAmount).toFixed(2)} €
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(invoice.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`/invoices/${invoice.id}`}
                          className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
                          title="Voir"
                        >
                          <Eye size={16} />
                        </a>
                        {invoice.status === "draft" && (
                          <a
                            href={`/invoices/edit/${invoice.id}`}
                            className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                            title="Modifier"
                          >
                            <Pencil size={16} />
                          </a>
                        )}
                        {invoice.status === "draft" && (
                          <button
                            onClick={() => handleValidate(invoice.id)}
                            className="text-green-500 hover:text-green-700 p-1 rounded hover:bg-green-50"
                            title="Valider"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        {invoice.status === "validated" && (
                          <button
                            onClick={() => handlePay(invoice.id)}
                            className="text-green-500 hover:text-green-700 p-1 rounded hover:bg-green-50"
                            title="Payer"
                          >
                            <CreditCard size={16} />
                          </button>
                        )}
                        {(invoice.status === "draft" || invoice.status === "validated") && (
                          <button
                            onClick={() => handleCancel(invoice.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                            title="Annuler"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">
                    Aucune facture trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
