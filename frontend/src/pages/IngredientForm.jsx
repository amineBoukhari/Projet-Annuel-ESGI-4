import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import IngredientService from "../services/ingredientService";
import Button from "../components/ui/Button";
import { ChevronLeft } from "lucide-react";

export default function IngredientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    unit: "",
    stockQuantity: "",
    minStockLevel: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (!isEdit) return;

    const loadIngredient = async () => {
      try {
        setLoading(true);
        const ingredient = await IngredientService.getById(id);
        setForm({
          name: ingredient.name || "",
          unit: ingredient.unit || "",
          stockQuantity: ingredient.stockQuantity ?? "",
          minStockLevel: ingredient.minStockLevel ?? "",
          imageUrl: ingredient.imageUrl || "",
        });
      } catch (error) {
        console.error(error);
        toast.error("Impossible de charger l'ingrédient");
      } finally {
        setLoading(false);
      }
    };

    loadIngredient();
  }, [id, isEdit]);

  const handleSave = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.unit.trim()) {
      toast.error("Le nom et l'unité sont requis");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: form.name.trim(),
        unit: form.unit.trim(),
        stockQuantity: Number(form.stockQuantity) || 0,
        minStockLevel: Number(form.minStockLevel) || 0,
        imageUrl: form.imageUrl.trim() || null,
      };

      if (isEdit) {
        await IngredientService.update(id, payload);
        toast.success("Ingrédient mis à jour");
        navigate(`/stocks/ingredients/${id}`);
      } else {
        await IngredientService.create(payload);
        toast.success("Ingrédient créé");
        navigate("/stocks/ingredients");
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
          onClick={() => navigate(isEdit ? `/stocks/ingredients/${id}` : "/stocks/ingredients")}
          className="inline-flex items-center gap-2 text-ink-muted hover:text-ink"
        >
          <ChevronLeft size={18} strokeWidth={2} />
          Retour
        </button>
      </div>

      <div className="bg-surface-raised rounded-[16px] p-6 shadow-ambient">
        <div className="mb-6">
          <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">
            {isEdit ? "Modifier l'ingrédient" : "Ajouter un ingrédient"}
          </h1>
          <p className="text-[0.9375rem] text-ink-muted mt-1">
            {isEdit
              ? "Mettez à jour les informations de l'ingrédient."
              : "Ajoutez un nouvel ingrédient au catalogue."}
          </p>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-2">
                Nom de l'ingrédient *
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full border border-border rounded-[12px] px-4 py-3 text-ink text-[0.9375rem] bg-surface-raised focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="Ex. Farine"
              />
            </div>
            <div>
              <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-2">
                Unité *
              </label>
              <input
                value={form.unit}
                onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value }))}
                className="w-full border border-border rounded-[12px] px-4 py-3 text-ink text-[0.9375rem] bg-surface-raised focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="kg, L, pcs"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-2">
                Quantité en stock
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.stockQuantity}
                onChange={(e) => setForm((prev) => ({ ...prev, stockQuantity: e.target.value }))}
                className="w-full border border-border rounded-[12px] px-4 py-3 text-ink text-[0.9375rem] bg-surface-raised focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-2">
                Seuil minimum
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.minStockLevel}
                onChange={(e) => setForm((prev) => ({ ...prev, minStockLevel: e.target.value }))}
                className="w-full border border-border rounded-[12px] px-4 py-3 text-ink text-[0.9375rem] bg-surface-raised focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="0"
              />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-2">
                URL de l'image
              </label>
              <input
                value={form.imageUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                className="w-full border border-border rounded-[12px] px-4 py-3 text-ink text-[0.9375rem] bg-surface-raised focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="https://..."
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                text="Annuler"
                variant="ghost"
                onClick={() => navigate(isEdit ? `/stocks/ingredients/${id}` : "/stocks/ingredients")}
              />
              <Button
                text={isEdit ? "Mettre à jour" : "Créer"}
                variant="primary"
                type="submit"
                disabled={saving}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
