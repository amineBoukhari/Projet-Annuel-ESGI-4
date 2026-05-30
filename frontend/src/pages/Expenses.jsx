import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import expenseService from "../services/expenseService";

const CATEGORY_LABELS = {
  utility: "Utilitaires",
  rent: "Loyer",
  transport: "Transport",
  supplies: "Fournitures",
  maintenance: "Maintenance",
  other: "Autre",
};

const CATEGORY_COLORS = {
  utility: "bg-blue-100 text-blue-700",
  rent: "bg-purple-100 text-purple-700",
  transport: "bg-orange-100 text-orange-700",
  supplies: "bg-green-100 text-green-700",
  maintenance: "bg-yellow-100 text-yellow-700",
  other: "bg-gray-100 text-gray-700",
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
      if (Array.isArray(data)) {
        setExpenses(data);
      } else {
        setExpenses([]);
      }
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dépenses</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez les dépenses non-fournisseurs (loyer, électricité, etc.)
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90"
        >
          <Plus size={16} />
          Ajouter
        </button>
      </div>

      {/* Filters + Total */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 flex-wrap">
          {["all", "utility", "rent", "transport", "supplies", "maintenance", "other"].map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${
                  filter === f
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f === "all" ? "Toutes" : CATEGORY_LABELS[f] || f}
              </button>
            ),
          )}
        </div>
        <div className="text-sm font-medium text-gray-700">
          Total: {totalAmount.toFixed(2)} €
        </div>
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
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Catégorie</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-right">Montant</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(expense.expenseDate).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.other
                      }`}
                    >
                      {CATEGORY_LABELS[expense.category] || expense.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{expense.description}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    {parseFloat(expense.amount).toFixed(2)} €
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">
                    Aucune dépense trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Nouvelle dépense
            </h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Catégorie
                </label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
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
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  placeholder="Facture EDF janvier"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Montant *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, amount: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
                  value={form.expenseDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, expenseDate: e.target.value }))
                  }
                />
              </div>
              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
