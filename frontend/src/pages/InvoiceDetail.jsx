import { useEffect, useState } from "react";
import { ArrowLeft, Printer } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router";
import invoiceService from "../services/invoiceService";

const STATUS_LABELS = {
  draft: "Brouillon",
  validated: "Validée",
  paid: "Payée",
  cancelled: "Annulée",
};

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await invoiceService.fetchInvoiceById(id);
        setInvoice(data);
      } catch {
        toast.error("Impossible de charger la facture");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-40 text-gray-400">
        Chargement...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Facture non trouvée.</p>
        <button
          onClick={() => navigate("/invoices")}
          className="mt-4 text-primary hover:underline"
        >
          Retour aux factures
        </button>
      </div>
    );
  }

  const subtotal = parseFloat(invoice.totalAmount) - parseFloat(invoice.taxAmount);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate("/invoices")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} />
        Retour aux factures
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {invoice.invoiceNumber}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(invoice.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700">
              {STATUS_LABELS[invoice.status] || invoice.status}
            </span>
          </div>
        </div>

        {/* Customer */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Client
          </h2>
          <p className="font-medium text-gray-900">{invoice.customerName}</p>
          {invoice.customerEmail && (
            <p className="text-sm text-gray-500">{invoice.customerEmail}</p>
          )}
        </div>

        {/* Line items */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Articles
          </h2>
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200">
              <tr className="text-left text-gray-500">
                <th className="pb-2">Description</th>
                <th className="pb-2 text-right">Qté</th>
                <th className="pb-2 text-right">Prix unit.</th>
                <th className="pb-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-2">{item.description}</td>
                  <td className="py-2 text-right">{item.quantity}</td>
                  <td className="py-2 text-right">
                    {parseFloat(item.unitPrice).toFixed(2)} €
                  </td>
                  <td className="py-2 text-right font-medium">
                    {parseFloat(item.totalPrice).toFixed(2)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Sous-total</span>
            <span>{subtotal.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">TVA (20%)</span>
            <span>{parseFloat(invoice.taxAmount).toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>{parseFloat(invoice.totalAmount).toFixed(2)} €</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200"
        >
          <Printer size={16} />
          Imprimer
        </button>
      </div>
    </div>
  );
}
