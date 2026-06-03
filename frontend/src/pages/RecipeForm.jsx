import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import RecipeService from "../services/recipeService";
import IngredientService from "../services/ingredientService";
import Button from "../components/ui/Button";

export default function RecipeForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [allIngredients, setAllIngredients] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    ingredients: [],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ingredients, recipe] = await Promise.all([
          IngredientService.getAll(),
          isEdit ? RecipeService.getById(id) : Promise.resolve(null),
        ]);
        setAllIngredients(Array.isArray(ingredients) ? ingredients : []);

        if (recipe) {
          setForm({
            name: recipe.name || "",
            description: recipe.description || "",
            ingredients: Array.isArray(recipe.ingredients)
              ? recipe.ingredients.map((item) => ({
                  ingredientId: item.id,
                  quantity: item.RecipeIngredient?.quantity || 0,
                }))
              : [],
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEdit]);

  const updateIngredientRow = (index, key, value) => {
    setForm((prev) => {
      const ingredients = [...prev.ingredients];
      ingredients[index] = { ...ingredients[index], [key]: value };
      return { ...prev, ingredients };
    });
  };

  const addIngredientRow = () => {
    setForm((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { ingredientId: "", quantity: "" }],
    }));
  };

  const removeIngredientRow = (index) => {
    setForm((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      toast.error("Le nom de la recette est requis");
      return;
    }

    const cleanedIngredients = form.ingredients
      .filter((item) => item.ingredientId && item.quantity !== "")
      .map((item) => ({
        ingredientId: Number(item.ingredientId),
        quantity: Number(item.quantity),
      }));

    try {
      setSaving(true);
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        ingredients: cleanedIngredients,
      };

      if (isEdit) {
        await RecipeService.update(id, payload);
        toast.success("Recette mise à jour");
        navigate(`/recipes/${id}`);
      } else {
        await RecipeService.create(payload);
        toast.success("Recette créée");
        navigate("/recipes");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

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
          onClick={() => navigate(isEdit ? `/recipes/${id}` : "/recipes")}
          className="inline-flex items-center gap-2 text-ink-muted hover:text-ink"
        >
          <ChevronLeft size={18} strokeWidth={2} />
          Retour
        </button>
      </div>

      <div className="bg-surface-raised rounded-[16px] p-6 shadow-ambient">
        <div className="mb-6">
          <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">
            {isEdit ? "Modifier la recette" : "Ajouter une recette"}
          </h1>
          <p className="text-[0.9375rem] text-ink-muted mt-1">
            {isEdit
              ? "Mettez à jour les ingrédients et la description." 
              : "Créez une nouvelle recette pour la préparation."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-2">
                Nom de la recette *
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full border border-border rounded-[12px] px-4 py-3 text-ink text-[0.9375rem] bg-surface-raised focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="Ex. Omelette au fromage"
              />
            </div>
            <div>
              <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-2">
                Description
              </label>
              <input
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full border border-border rounded-[12px] px-4 py-3 text-ink text-[0.9375rem] bg-surface-raised focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="Description courte de la recette"
              />
            </div>
          </div>

          <div className="bg-surface rounded-[16px] border border-border p-5">
            <div className="flex items-center justify-between mb-4 gap-3">
              <div>
                <h2 className="text-[1rem] font-semibold text-ink">Ingrédients</h2>
                <p className="text-[0.875rem] text-ink-muted mt-1">Ajoutez les ingrédients et la quantité nécessaire.</p>
              </div>
              <button
                type="button"
                onClick={addIngredientRow}
                className="inline-flex items-center gap-2 rounded-[10px] bg-secondary text-ink px-4 py-2 text-[0.8125rem] font-medium hover:bg-secondary-hover transition-all duration-150"
              >
                <Plus size={16} strokeWidth={2} />
                Ajouter
              </button>
            </div>

            {form.ingredients.length === 0 ? (
              <div className="rounded-[12px] border border-dashed border-border p-6 text-center text-ink-muted">
                Aucun ingrédient ajouté.
              </div>
            ) : (
              <div className="space-y-4">
                {form.ingredients.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr_0.6fr_auto] gap-3 items-end">
                    <div>
                      <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-2">Ingrédient</label>
                      <select
                        value={item.ingredientId}
                        onChange={(e) => updateIngredientRow(index, "ingredientId", e.target.value)}
                        className="w-full border border-border rounded-[12px] px-4 py-3 text-ink text-[0.9375rem] bg-surface-raised focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                      >
                        <option value="">Choisir un ingrédient</option>
                        {allIngredients.map((ingredient) => (
                          <option key={ingredient.id} value={ingredient.id}>
                            {ingredient.name} ({ingredient.unit})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-2">Quantité</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => updateIngredientRow(index, "quantity", e.target.value)}
                        className="w-full border border-border rounded-[12px] px-4 py-3 text-ink text-[0.9375rem] bg-surface-raised focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        placeholder="0"
                      />
                    </div>
                    <div className="lg:col-span-1">
                      <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-2">Unité</label>
                      <div className="h-full rounded-[12px] border border-border bg-surface-raised px-4 py-3 text-[0.9375rem] text-ink flex items-center">
                        {allIngredients.find((ingredient) => String(ingredient.id) === String(item.ingredientId))?.unit || "-"}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeIngredientRow(index)}
                      className="text-error hover:text-red-700 p-3 rounded-[12px] hover:bg-red-50 transition-all duration-150"
                      title="Supprimer l'ingrédient"
                    >
                      <Trash2 size={18} strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
            <Button
              text="Annuler"
              variant="ghost"
              onClick={() => navigate(isEdit ? `/recipes/${id}` : "/recipes")}
            />
            <Button text={isEdit ? "Mettre à jour" : "Créer"} type="submit" variant="primary" disabled={saving} />
          </div>
        </form>
      </div>
    </div>
  );
}
