import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Trash2, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import IngredientService from "../services/ingredientService";
import RecipeService from "../services/recipeService";
import WasteService from "../services/wasteService";
import Button from "../components/ui/Button";

const emptyRow = () => ({
  id: crypto.randomUUID(),
  type: "ingredient",
  ingredientId: "",
  recipeId: "",
  quantity: "",
  portions: 1,
  cost: "",
  reason: "",
});

export default function Waste() {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rows, setRows] = useState([emptyRow()]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [allIngredients, allRecipes] = await Promise.all([
        IngredientService.getAll(),
        RecipeService.getAll(),
      ]);
      setIngredients(Array.isArray(allIngredients) ? allIngredients : []);
      setRecipes(Array.isArray(allRecipes) ? allRecipes : []);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger les données");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateRow = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const addRow = () => {
    setRows((prev) => [...prev, emptyRow()]);
  };

  const removeRow = (id) => {
    setRows((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((row) => row.id !== id);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const items = [];
    for (const row of rows) {
      if (!row.reason.trim()) {
        toast.error("Chaque ligne doit avoir une raison");
        return;
      }

      const item = {
        type: row.type,
        reason: row.reason.trim(),
        cost: row.cost ? parseFloat(row.cost) : 0,
      };

      if (row.type === "ingredient") {
        if (!row.ingredientId) {
          toast.error("Sélectionnez un ingrédient pour chaque ligne");
          return;
        }
        item.ingredientId = Number(row.ingredientId);
        item.quantity = Math.abs(Number(row.quantity)) || 1;
      } else {
        if (!row.recipeId) {
          toast.error("Sélectionnez une recette pour chaque ligne");
          return;
        }
        item.recipeId = Number(row.recipeId);
        item.portions = Math.max(1, Number(row.portions) || 1);
      }

      items.push(item);
    }

    try {
      setSubmitting(true);
      const result = await WasteService.addWaste({ items });
      toast.success(result?.message || "Pertes enregistrées");
      setRows([emptyRow()]);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Erreur lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  const totalCost = rows.reduce(
    (sum, row) => sum + (parseFloat(row.cost) || 0),
    0,
  );

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-surface rounded w-1/3"></div>
        <div className="h-64 bg-surface rounded-[16px]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/stocks")}
          className="inline-flex items-center gap-2 text-ink-muted hover:text-ink"
        >
          <ChevronLeft size={18} strokeWidth={2} />
          Retour aux stocks
        </button>
      </div>

      <div className="bg-surface-raised rounded-[16px] p-6 shadow-ambient">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">
              Déclarer des pertes
            </h1>
            <p className="text-[0.9375rem] text-ink-muted mt-1">
              Ajoutez une ou plusieurs pertes. Les stocks seront déduits et des charges seront créées.
            </p>
          </div>
          <Button
            text="Ajouter une ligne"
            variant="secondary"
            icon={Plus}
            onClick={addRow}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-[0.9375rem]">
              <thead className="bg-surface">
                <tr>
                  <th className="px-3 py-3 text-left text-[0.75rem] font-semibold text-ink-secondary uppercase tracking-wider w-[100px]">
                    Type
                  </th>
                  <th className="px-3 py-3 text-left text-[0.75rem] font-semibold text-ink-secondary uppercase tracking-wider">
                    Élément
                  </th>
                  <th className="px-3 py-3 text-left text-[0.75rem] font-semibold text-ink-secondary uppercase tracking-wider w-[100px]">
                    Qté / Port.
                  </th>
                  <th className="px-3 py-3 text-left text-[0.75rem] font-semibold text-ink-secondary uppercase tracking-wider w-[120px]">
                    Coût (€)
                  </th>
                  <th className="px-3 py-3 text-left text-[0.75rem] font-semibold text-ink-secondary uppercase tracking-wider">
                    Raison
                  </th>
                  <th className="px-3 py-3 w-[40px]" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-3 py-3">
                      <select
                        value={row.type}
                        onChange={(e) =>
                          updateRow(row.id, "type", e.target.value)
                        }
                        className="w-full border border-border rounded-[8px] px-2 py-2 text-[0.8125rem] text-ink bg-surface-raised focus:outline-none focus:border-primary"
                      >
                        <option value="ingredient">Ingrédient</option>
                        <option value="recipe">Recette</option>
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      {row.type === "ingredient" ? (
                        <select
                          value={row.ingredientId}
                          onChange={(e) =>
                            updateRow(row.id, "ingredientId", e.target.value)
                          }
                          className="w-full border border-border rounded-[8px] px-2 py-2 text-[0.8125rem] text-ink bg-surface-raised focus:outline-none focus:border-primary"
                        >
                          <option value="">Sélectionner...</option>
                          {ingredients.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name} ({item.stockQuantity} {item.unit})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <select
                          value={row.recipeId}
                          onChange={(e) =>
                            updateRow(row.id, "recipeId", e.target.value)
                          }
                          className="w-full border border-border rounded-[8px] px-2 py-2 text-[0.8125rem] text-ink bg-surface-raised focus:outline-none focus:border-primary"
                        >
                          <option value="">Sélectionner...</option>
                          {recipes.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {row.type === "ingredient" ? (
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={row.quantity}
                          onChange={(e) =>
                            updateRow(row.id, "quantity", e.target.value)
                          }
                          className="w-full border border-border rounded-[8px] px-2 py-2 text-[0.8125rem] text-ink bg-surface-raised focus:outline-none focus:border-primary"
                          placeholder="Qté"
                        />
                      ) : (
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={row.portions}
                          onChange={(e) =>
                            updateRow(
                              row.id,
                              "portions",
                              Number(e.target.value),
                            )
                          }
                          className="w-full border border-border rounded-[8px] px-2 py-2 text-[0.8125rem] text-ink bg-surface-raised focus:outline-none focus:border-primary"
                        />
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={row.cost}
                        onChange={(e) =>
                          updateRow(row.id, "cost", e.target.value)
                        }
                        className="w-full border border-border rounded-[8px] px-2 py-2 text-[0.8125rem] text-ink bg-surface-raised focus:outline-none focus:border-primary"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        value={row.reason}
                        onChange={(e) =>
                          updateRow(row.id, "reason", e.target.value)
                        }
                        className="w-full border border-border rounded-[8px] px-2 py-2 text-[0.8125rem] text-ink bg-surface-raised focus:outline-none focus:border-primary"
                        placeholder="Raison de la perte"
                      />
                    </td>
                    <td className="px-3 py-3">
                      {rows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRow(row.id)}
                          className="text-ink-muted hover:text-red-500 transition-colors"
                        >
                          <X size={16} strokeWidth={2} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rows.length === 0 && (
            <p className="text-center text-ink-muted py-8">
              Aucune perte ajoutée. Cliquez sur &quot;Ajouter une ligne&quot; pour commencer.
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border">
            <div className="text-[0.9375rem] text-ink">
              <span className="text-ink-secondary">Total des coûts : </span>
              <span className="font-semibold">{totalCost.toFixed(2)} €</span>
              <span className="text-ink-muted text-[0.8125rem] ml-2">
                ({rows.length} ligne{rows.length > 1 ? "s" : ""})
              </span>
            </div>
            <div className="flex gap-3">
              <Button
                text="Annuler"
                variant="ghost"
                onClick={() => navigate("/stocks")}
              />
              <Button
                text="Enregistrer toutes les pertes"
                variant="primary"
                icon={Trash2}
                type="submit"
                disabled={submitting}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
