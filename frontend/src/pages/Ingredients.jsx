import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Plus, AlertTriangle, Box, Package, Eye, Pencil, Trash2, Clock } from "lucide-react";
import toast from "react-hot-toast";
import IngredientService from "../services/ingredientService";
import Button from "../components/ui/Button";

export default function Ingredients() {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadIngredients = async () => {
    setLoading(true);
    try {
      const data = await IngredientService.getAll();
      setIngredients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger les ingrédients");
      setIngredients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet ingrédient ?")) return;
    try {
      await IngredientService.remove(id);
      toast.success("Ingrédient supprimé");
      await loadIngredients();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const lowStockCount = ingredients.filter(
    (ingredient) => ingredient.stockQuantity < ingredient.minStockLevel,
  ).length;
  const totalQuantity = ingredients.reduce(
    (sum, ingredient) => sum + Number(ingredient.stockQuantity || 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">Ingrédients</h1>
          <p className="text-[0.9375rem] text-ink-muted mt-1">
            Gérez les ingrédients, les stocks et les mouvements.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            text="Nouveau ingrédient"
            variant="primary"
            icon={Plus}
            onClick={() => navigate("/stocks/ingredients/new")}
          />
          <Button
            text="Alertes bas stock"
            variant="ghost"
            icon={AlertTriangle}
            onClick={() => navigate("/stocks/low-stock")}
          />
          <Button
            text="Alertes péremption"
            variant="ghost"
            icon={Clock}
            onClick={() => navigate("/stocks/expiring-ingredients")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center">
              <Box size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">Total</span>
          </div>
          <p className="text-[1.5rem] font-semibold text-ink">{ingredients.length}</p>
        </div>
        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center">
              <AlertTriangle size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">En faible stock</span>
          </div>
          <p className="text-[1.5rem] font-semibold text-ink">{lowStockCount}</p>
        </div>
        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center">
              <Package size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">Stock total</span>
          </div>
          <p className="text-[1.5rem] font-semibold text-ink">{totalQuantity}</p>
        </div>
        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center">
              <Eye size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">Actions</span>
          </div>
          <p className="text-[1.5rem] font-semibold text-ink-muted">Voir, modifier et surveiller</p>
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
                  {[
                    "Nom",
                    "Unité",
                    "Stock",
                    "Seuil",
                    "Statut",
                    "",
                  ].map((header) => (
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
                {ingredients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-ink-muted text-[0.9375rem]">
                      Aucun ingrédient trouvé.
                    </td>
                  </tr>
                ) : (
                  ingredients.map((ingredient) => {
                    const isLow = ingredient.stockQuantity < ingredient.minStockLevel;
                    return (
                      <tr key={ingredient.id} className="hover:bg-surface transition-colors duration-150">
                        <td className="px-5 py-4 font-medium text-ink">{ingredient.name}</td>
                        <td className="px-5 py-4 text-ink-secondary">{ingredient.unit}</td>
                        <td className="px-5 py-4 text-ink">{ingredient.stockQuantity}</td>
                        <td className="px-5 py-4 text-ink-secondary">{ingredient.minStockLevel}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.75rem] font-semibold ${
                            isLow ? "bg-secondary-muted text-warning" : "bg-green-50 text-success"
                          }`}>
                            {isLow ? "Faible" : "OK"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => navigate(`/stocks/ingredients/${ingredient.id}`)}
                              className="text-ink-muted hover:text-ink p-2 rounded-[8px] hover:bg-surface transition-all duration-150"
                              title="Voir"
                            >
                              <Eye size={16} strokeWidth={2} />
                            </button>
                            <button
                              onClick={() => navigate(`/stocks/ingredients/${ingredient.id}/edit`)}
                              className="text-ink-muted hover:text-ink p-2 rounded-[8px] hover:bg-surface transition-all duration-150"
                              title="Modifier"
                            >
                              <Pencil size={16} strokeWidth={2} />
                            </button>
                            <button
                              onClick={() => handleDelete(ingredient.id)}
                              className="text-error hover:text-red-700 p-2 rounded-[8px] hover:bg-red-50 transition-all duration-150"
                              title="Supprimer"
                            >
                              <Trash2 size={16} strokeWidth={2} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
