import { useState } from "react";
import { X, UtensilsCrossed, Check, Copy } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button";
import restaurantService from "../../../services/restaurantService";

const INITIAL_FORM = {
  name: "",
  adress: "",
  adminName: "",
  adminEmail: "",
  adminPassword: "",
};

export default function CreateRestaurantModal({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())         e.name         = "Le nom est requis";
    if (!form.adress.trim())       e.adress        = "L'adresse est requise";
    if (!form.adminName.trim())    e.adminName    = "Le nom de l'admin est requis";
    if (!form.adminEmail.trim())   e.adminEmail   = "L'email de l'admin est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.adminEmail)) e.adminEmail = "Email invalide";
    if (!form.adminPassword)       e.adminPassword = "Le mot de passe est requis";
    else if (form.adminPassword.length < 4) e.adminPassword = "Min. 4 caractères";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await restaurantService.createRestaurant(form);
      setCreated({ ...form });
      onCreated();
    } catch (err) {
      setErrors({ global: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setCreated(null);
    setCopied(false);
    onClose();
  };

  const copyCredentials = () => {
    navigator.clipboard.writeText(
      `Restaurant : ${created.name}\nEmail admin : ${created.adminEmail}\nMot de passe : ${created.adminPassword}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (created) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
        <div className="w-full max-w-[400px] bg-surface-raised rounded-[16px] shadow-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-50 text-success flex items-center justify-center">
                <Check size={18} strokeWidth={2} />
              </div>
              <h2 className="text-[1.125rem] font-semibold text-success">Restaurant créé</h2>
            </div>
            <button onClick={handleClose} className="text-ink-muted hover:text-ink p-1.5 rounded-[8px] hover:bg-surface transition-all">
              <X size={18} strokeWidth={2} />
            </button>
          </div>
          <div className="bg-surface rounded-[12px] p-4 mb-4 border border-border">
            <p className="text-[0.8125rem] text-ink-secondary mb-3">
              Transmettez ces identifiants à <strong className="text-ink">{created.adminName}</strong> :
            </p>
            <div className="text-[0.8125rem] font-mono bg-surface-raised rounded-[10px] p-3 border border-border space-y-1">
              <p className="text-ink-secondary">Restaurant : <span className="text-ink font-medium">{created.name}</span></p>
              <p className="text-ink-secondary">Email : <span className="text-ink font-medium">{created.adminEmail}</span></p>
              <p className="text-ink-secondary">Mot de passe : <span className="text-ink font-medium">{created.adminPassword}</span></p>
            </div>
          </div>
          <Button
            text={copied ? "Copié !" : "Copier les identifiants"}
            variant="primary"
            icon={copied ? Check : Copy}
            onClick={copyCredentials}
            className="w-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="w-full max-w-[460px] bg-surface-raised rounded-[16px] shadow-elevated p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-muted text-primary flex items-center justify-center">
              <UtensilsCrossed size={16} strokeWidth={2} />
            </div>
            <h2 className="text-[1.125rem] font-semibold text-ink">Nouveau restaurant</h2>
          </div>
          <button onClick={handleClose} className="text-ink-muted hover:text-ink p-1.5 rounded-[8px] hover:bg-surface transition-all">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {errors.global && (
          <div className="mb-4 rounded-[10px] bg-red-50 text-error text-[0.8125rem] font-medium px-4 py-3">
            {errors.global}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-[0.75rem] font-semibold text-ink-secondary uppercase tracking-wider">
            Informations du restaurant
          </p>

          <div>
            <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-1.5">Nom</label>
            <input
              type="text"
              className="w-full border border-border rounded-[10px] px-4 py-2.5 text-[0.9375rem] text-ink bg-surface-raised focus:outline-none focus:border-primary focus:shadow-lifted transition-all placeholder:text-ink-muted"
              placeholder="Le Petit Bistro"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
            {errors.name && <p className="text-error text-[0.75rem] font-medium mt-1.5">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-1.5">Adresse</label>
            <input
              type="text"
              className="w-full border border-border rounded-[10px] px-4 py-2.5 text-[0.9375rem] text-ink bg-surface-raised focus:outline-none focus:border-primary focus:shadow-lifted transition-all placeholder:text-ink-muted"
              placeholder="12 Rue de Rivoli, Paris"
              value={form.adress}
              onChange={(e) => set("adress", e.target.value)}
            />
            {errors.adress && <p className="text-error text-[0.75rem] font-medium mt-1.5">{errors.adress}</p>}
          </div>

          <p className="text-[0.75rem] font-semibold text-ink-secondary uppercase tracking-wider pt-1">
            Compte Owner
          </p>

          <div>
            <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-1.5">Nom de l'owner</label>
            <input
              type="text"
              className="w-full border border-border rounded-[10px] px-4 py-2.5 text-[0.9375rem] text-ink bg-surface-raised focus:outline-none focus:border-primary focus:shadow-lifted transition-all placeholder:text-ink-muted"
              placeholder="Jean Dupont"
              value={form.adminName}
              onChange={(e) => set("adminName", e.target.value)}
            />
            {errors.adminName && <p className="text-error text-[0.75rem] font-medium mt-1.5">{errors.adminName}</p>}
          </div>

          <div>
            <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-1.5">Email de l'owner</label>
            <input
              type="email"
              className="w-full border border-border rounded-[10px] px-4 py-2.5 text-[0.9375rem] text-ink bg-surface-raised focus:outline-none focus:border-primary focus:shadow-lifted transition-all placeholder:text-ink-muted"
              placeholder="jean@restaurant.com"
              value={form.adminEmail}
              onChange={(e) => set("adminEmail", e.target.value)}
            />
            {errors.adminEmail && <p className="text-error text-[0.75rem] font-medium mt-1.5">{errors.adminEmail}</p>}
          </div>

          <div>
            <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-1.5">Mot de passe</label>
            <input
              type="password"
              className="w-full border border-border rounded-[10px] px-4 py-2.5 text-[0.9375rem] text-ink bg-surface-raised focus:outline-none focus:border-primary focus:shadow-lifted transition-all placeholder:text-ink-muted"
              placeholder="••••••••"
              value={form.adminPassword}
              onChange={(e) => set("adminPassword", e.target.value)}
            />
            {errors.adminPassword && <p className="text-error text-[0.75rem] font-medium mt-1.5">{errors.adminPassword}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 mt-2 pt-2 border-t border-border">
            <Button text="Annuler" variant="ghost" onClick={handleClose} />
            <Button
              text={loading ? "Création..." : "Créer le restaurant"}
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
