import { useEffect, useState } from "react";
import { Plus, Trash2, Filter } from "lucide-react";
import toast from "react-hot-toast";
import expenseService from "../services/expenseService";
import Button from "../components/ui/Button";

const CATEGORY_LABELS = {
  utility: "Utilitaires",
  rent: "Loyer",
  transport: "Transport",
  supplies: "Fournitures",
  maintenance: "Maintenance",
  other: "Autre",
};

const CATEGORY_COLORS = {
  utility: "bg-blue-50 text-info",
  rent: "bg-purple-50 text-purple-700",
  transport: "bg-orange-50 text-orange-700",
  supplies: "bg-green-50 text-success",
  maintenance: "bg-secondary-muted text-warning",
  other: "bg-surface text-ink-secondary",
};

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const [form, setForm] = useState({
    category: "other",
    description: "",
    amount: "",
    expenseDate: new Date().toISOString().split("T")[0],
  });

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const data = await expenseService.fetchExpenses();
      setExpenses(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Impossible de charger les dépenses");
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.description.trim() || !form.amount) {
      toast.error("Description et montant requis");
      return;
    }
    try {
      await expenseService.createExpense(form);
      toast.success("Dépense ajoutée");
      setForm({
        category: "other",
        description: "",
        amount: "",
        expenseDate: new Date().toISOString().split("T")[0],
      });
      setIsModalOpen(false);
      await loadExpenses();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette dépense ?")) return;
    try {
      await expenseService.deleteExpense(id);
      toast.success("Dépense supprimée");
      await loadExpenses();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredExpenses = expenses.filter((exp) => {
    if (filter === "all") return true;
    return exp.category === filter;
  });

  const totalAmount = filteredExpenses.reduce(
    (sum, exp) => sum + parseFloat(exp.amount || 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">Dépenses</h1>
          <p className="text-[0.9375rem] text-ink-muted mt-1">
            Gérez les dépenses non-fournisseurs (loyer, électricité, etc.)
          </p>
        </div>
        <Button
          text="Ajouter"
          variant="primary"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      {/* Filters + Total */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 flex-wrap items-center">
          <Filter size={16} className="text-ink-muted" strokeWidth={2} />
          {["all", "utility", "rent", "transport", "supplies", "maintenance", "other"].map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-2 rounded-[10px] text-[0.8125rem] font-medium transition-all duration-150 ${
                  filter === f
                    ? "bg-ink text-white shadow-ambient"
                    : "bg-surface-raised text-ink-secondary hover:bg-surface hover:text-ink border border-border"
                }`}
              >
                {f === "all" ? "Toutes" : CATEGORY_LABELS[f] || f}
              </button>
            ),
          )}
        </div>
        <div className="text-[0.9375rem] font-semibold text-ink">
          Total: {totalAmount.toFixed(2)} €
        </div>
      </div>

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
                  {["Date", "Catégorie", "Description", "Montant", ""].map((header) => (
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
                {filteredExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="hover:bg-surface transition-colors duration-150"
                  >
                    <td className="px-5 py-4 text-ink-muted text-[0.8125rem]">
                      {new Date(expense.expenseDate).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.75rem] font-semibold ${
                        CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.other
                      }`}>
                        {CATEGORY_LABELS[expense.category] || expense.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-ink-secondary">{expense.description}</td>
                    <td className="px-5 py-4 text-right font-semibold text-ink">
                      {parseFloat(expense.amount).toFixed(2)} €
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-error hover:text-red-700 p-2 rounded-[8px] hover:bg-red-50 transition-all duration-150"
                        title="Supprimer"
                      >
                        <Trash2 size={16} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredExpenses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-ink-muted text-[0.9375rem]">
                      Aucune dépense trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-[400px] bg-surface-raised rounded-[16px] shadow-elevated p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[1.125rem] font-semibold text-ink">
                Nouvelle dépense
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-ink-muted hover:text-ink p-1.5 rounded-[8px] hover:bg-surface transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-1.5">
                  Catégorie
                </label>
                <select
                  className="w-full border border-border rounded-[10px] px-4 py-2.5 text-[0.9375rem] text-ink bg-surface-raised focus:outline-none focus:border-primary focus:shadow-lifted transition-all duration-200"
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                >
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-1.5">
                  Description *
                </label>
                <input
                  type="text"
                  className="w-full border border-border rounded-[10px] px-4 py-2.5 text-[0.9375rem] text-ink bg-surface-raised focus:outline-none focus:border-primary focus:shadow-lifted transition-all duration-200 placeholder:text-ink-muted"
                  placeholder="Facture EDF janvier"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-1.5">
                  Montant *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full border border-border rounded-[10px] px-4 py-2.5 text-[0.9375rem] text-ink bg-surface-raised focus:outline-none focus:border-primary focus:shadow-lifted transition-all duration-200 placeholder:text-ink-muted"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, amount: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full border border-border rounded-[10px] px-4 py-2.5 text-[0.9375rem] text-ink bg-surface-raised focus:outline-none focus:border-primary focus:shadow-lifted transition-all duration-200"
                  value={form.expenseDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, expenseDate: e.target.value }))
                  }
                />
              </div>
              <div className="flex items-center justify-end gap-3 mt-2 pt-2 border-t border-border">
                <Button
                  text="Annuler"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                />
                <Button
                  text="Ajouter"
                  variant="primary"
                  type="submit"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
