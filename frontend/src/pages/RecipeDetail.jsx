import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Pencil, Flame, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import RecipeService from "../services/recipeService";
import Button from "../components/ui/Button";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        setLoading(true);
        const data = await RecipeService.getById(id);
        setRecipe(data);
      } catch (error) {
        console.error(error);
        toast.error("Impossible de charger la recette");
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-surface rounded w-1/3"></div>
        <div className="h-64 bg-surface rounded-[16px]"></div>
      </div>
    );
  }

  if (!recipe) {
    return <div className="text-ink-muted">Recette introuvable.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate("/recipes")}
            className="inline-flex items-center gap-2 text-ink-muted hover:text-ink mb-3"
          >
            <ChevronLeft size={18} strokeWidth={2} />
            Retour à la liste
          </button>
          <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">{recipe.name}</h1>
          <p className="text-[0.9375rem] text-ink-muted mt-1">Détails de la recette et ingrédients requis.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            text="Modifier"
            variant="secondary"
            icon={Pencil}
            onClick={() => navigate(`/recipes/${id}/edit`)}
          />
          <Button
            text="Préparer"
            variant="primary"
            icon={Flame}
            onClick={() => navigate(`/recipes/${id}/cook`)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-surface-raised rounded-[16px] p-6 shadow-ambient">
          <h2 className="text-[1rem] font-semibold text-ink mb-4">Informations</h2>
          <div className="space-y-4 text-[0.9375rem] text-ink-secondary">
            <div>
              <p className="font-medium text-ink">Nom</p>
              <p>{recipe.name}</p>
            </div>
            <div>
              <p className="font-medium text-ink">Description</p>
              <p>{recipe.description || "Aucune description"}</p>
            </div>
            <div>
              <p className="font-medium text-ink">Nombre d'ingrédients</p>
              <p>{recipe.ingredients?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-surface-raised rounded-[16px] p-6 shadow-ambient">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-[1rem] font-semibold text-ink">Ingrédients</h2>
              <p className="text-[0.875rem] text-ink-muted mt-1">Quantités nécessaires pour la recette.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[0.9375rem]">
              <thead className="bg-surface">
                <tr>
                  {['Nom', 'Quantité', 'Unité', 'Stock actuel'].map((header) => (
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
                {recipe.ingredients?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-ink-muted text-[0.9375rem]">
                      Aucun ingrédient défini pour cette recette.
                    </td>
                  </tr>
                ) : (
                  recipe.ingredients.map((item) => (
                    <tr key={item.id} className="hover:bg-surface transition-colors duration-150">
                      <td className="px-5 py-4 font-medium text-ink">{item.name}</td>
                      <td className="px-5 py-4 text-ink">{item.RecipeIngredient?.quantity}</td>
                      <td className="px-5 py-4 text-ink-secondary">{item.unit}</td>
                      <td className="px-5 py-4 text-ink-secondary">{item.stockQuantity ?? '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
