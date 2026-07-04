import { useState, useEffect } from "react";
import { X, Pencil } from "lucide-react";
import Button from "../../../components/ui/Button";
import restaurantService from "../../../services/restaurantService";
import toast from "react-hot-toast";

export default function EditRestaurantModal({ restaurant, onClose, onSaved, isAdmin = true }) {
  const [form, setForm] = useState({ name: "", adress: "", whatsappNumber: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (restaurant) {
      setForm({
        name: restaurant.name || "",
        adress: restaurant.adress || "",
        whatsappNumber: restaurant.whatsappNumber || "",
      });
    }
  }, [restaurant]);

  if (!restaurant) return null;

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const validate = () => {
    if (!isAdmin) return true;
    const e = {};
    if (!form.name.trim())   e.name   = "Le nom est requis";
    if (!form.adress.trim()) e.adress = "L'adresse est requise";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await restaurantService.updateRestaurant(restaurant.id, form);
      toast.success("Restaurant mis à jour");
      onSaved();
    } catch (err) {
      toast.error(err.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="w-full max-w-[420px] bg-surface-raised rounded-[16px] shadow-elevated p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-muted text-primary flex items-center justify-center">
              <Pencil size={15} strokeWidth={2} />
            </div>
            <h2 className="text-[1.125rem] font-semibold text-ink">Modifier le restaurant</h2>
          </div>
          <button onClick={onClose} className="text-ink-muted hover:text-ink p-1.5 rounded-[8px] hover:bg-surface transition-all">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-1.5">Nom</label>
            <input
              type="text"
              disabled={!isAdmin}
              className="w-full border border-border rounded-[10px] px-4 py-2.5 text-[0.9375rem] text-ink bg-surface-raised focus:outline-none focus:border-primary focus:shadow-lifted transition-all placeholder:text-ink-muted disabled:opacity-60 disabled:cursor-not-allowed"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
            {errors.name && <p className="text-error text-[0.75rem] font-medium mt-1.5">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-1.5">Adresse</label>
            <input
              type="text"
              disabled={!isAdmin}
              className="w-full border border-border rounded-[10px] px-4 py-2.5 text-[0.9375rem] text-ink bg-surface-raised focus:outline-none focus:border-primary focus:shadow-lifted transition-all placeholder:text-ink-muted disabled:opacity-60 disabled:cursor-not-allowed"
              value={form.adress}
              onChange={(e) => set("adress", e.target.value)}
            />
            {errors.adress && <p className="text-error text-[0.75rem] font-medium mt-1.5">{errors.adress}</p>}
          </div>

          <div>
            <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-1.5">Numéro WhatsApp</label>
            <input
              type="text"
              placeholder="+33612345678"
              className="w-full border border-border rounded-[10px] px-4 py-2.5 text-[0.9375rem] text-ink bg-surface-raised focus:outline-none focus:border-primary focus:shadow-lifted transition-all placeholder:text-ink-muted"
              value={form.whatsappNumber}
              onChange={(e) => set("whatsappNumber", e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-2 pt-2 border-t border-border">
            <Button text="Annuler" variant="ghost" onClick={onClose} />
            <Button
              text={loading ? "Sauvegarde..." : "Sauvegarder"}
              variant="primary"
              type="submit"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
