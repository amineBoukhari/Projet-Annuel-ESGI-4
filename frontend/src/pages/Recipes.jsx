import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Flame, Eye, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import RecipeService from "../services/recipeService";
import Button from "../components/ui/Button";

export default function Recipes() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const data = await RecipeService.getAll();
      setRecipes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger les recettes");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette recette ?")) return;
    try {
      await RecipeService.remove(id);
      toast.success("Recette supprimée");
      await loadRecipes();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">Recettes</h1>
          <p className="text-[0.9375rem] text-ink-muted mt-1">
            Gérez vos recettes et les instructions de préparation.
          </p>
        </div>
        <Button
          text="Nouvelle recette"
          variant="primary"
          icon={Plus}
          onClick={() => navigate("/recipes/new")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center">
              <Flame size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">Recettes</span>
          </div>
          <p className="text-[1.5rem] font-semibold text-ink">{recipes.length}</p>
        </div>
        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center">
              <Plus size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">Ingrédients / recette</span>
          </div>
          <p className="text-[1.5rem] font-semibold text-ink">{recipes.reduce((sum, recipe) => sum + (recipe.ingredients?.length || 0), 0)}</p>
        </div>
        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center">
              <Eye size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">Vue rapide</span>
          </div>
          <p className="text-[1.5rem] font-semibold text-ink-muted">Consultez et préparez</p>
        </div>
        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center">
              <Pencil size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">Édition</span>
          </div>
          <p className="text-[1.5rem] font-semibold text-ink-muted">Modifier rapidement</p>
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
                  {['Nom', 'Ingrédients', 'Description', 'Actions'].map((header) => (
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
                {recipes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-ink-muted text-[0.9375rem]">
                      Aucune recette trouvée.
                    </td>
                  </tr>
                ) : (
                  recipes.map((recipe) => (
                    <tr key={recipe.id} className="hover:bg-surface transition-colors duration-150">
                      <td className="px-5 py-4 font-medium text-ink">{recipe.name}</td>
                      <td className="px-5 py-4 text-ink-secondary">{recipe.ingredients?.length || 0}</td>
                      <td className="px-5 py-4 text-ink-secondary truncate max-w-[280px]">{recipe.description || '-'}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/recipes/${recipe.id}`)}
                            className="text-ink-muted hover:text-ink p-2 rounded-[8px] hover:bg-surface transition-all duration-150"
                            title="Voir"
                          >
                            <Eye size={16} strokeWidth={2} />
                          </button>
                          <button
                            onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
                            className="text-ink-muted hover:text-ink p-2 rounded-[8px] hover:bg-surface transition-all duration-150"
                            title="Modifier"
                          >
                            <Pencil size={16} strokeWidth={2} />
                          </button>
                          <button
                            onClick={() => navigate(`/recipes/${recipe.id}/cook`)}
                            className="text-success hover:text-green-700 p-2 rounded-[8px] hover:bg-green-50 transition-all duration-150"
                            title="Préparer"
                          >
                            <Flame size={16} strokeWidth={2} />
                          </button>
                          <button
                            onClick={() => handleDelete(recipe.id)}
                            className="text-error hover:text-red-700 p-2 rounded-[8px] hover:bg-red-50 transition-all duration-150"
                            title="Supprimer"
                          >
                            <Trash2 size={16} strokeWidth={2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
