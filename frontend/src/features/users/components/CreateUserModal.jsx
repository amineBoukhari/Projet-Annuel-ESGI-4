import { useState } from "react";
import { X, Copy, Check, UserPlus } from "lucide-react";
import Button from "../../../components/ui/Button";

const ROLES = [
  { id: 1, name: "Admin", endpoint: "createOwner" },
  { id: 2, name: "Owner", endpoint: "createManager" },
  { id: 3, name: "Manager", endpoint: "createEmployee" },
  { id: 4, name: "Employee", endpoint: "createUser" },
];

export default function CreateUserModal({ isOpen, onClose, onCreate }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    roleId: 4,
    mustChangePassword: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = "Le nom est requis";
    if (!form.email.trim()) newErrors.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Email invalide";
    if (!form.password) newErrors.password = "Le mot de passe est requis";
    else if (form.password.length < 4)
      newErrors.password = "Min. 4 caractères";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const role = ROLES.find((r) => r.id === parseInt(form.roleId));
      await onCreate({ ...form, endpoint: role.endpoint });
      setCreatedUser({
        username: form.username,
        email: form.email,
        password: form.password,
        role: role.name,
      });
    } catch (err) {
      setErrors({ global: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({
      username: "",
      email: "",
      password: "",
      roleId: 4,
      mustChangePassword: true,
    });
    setErrors({});
    setCreatedUser(null);
    setCopied(false);
    onClose();
  };

  const copyCredentials = () => {
    const text = `Email: ${createdUser.email}\nMot de passe: ${createdUser.password}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (createdUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
        <div className="w-full bg-surface-raised rounded-[16px] shadow-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-50 text-success flex items-center justify-center">
                <Check size={18} strokeWidth={2} />
              </div>
              <h2 className="text-[1.125rem] font-semibold text-success">
                Utilisateur créé
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-ink-muted hover:text-ink p-1.5 rounded-[8px] hover:bg-surface transition-all"
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>

          <div className="bg-surface rounded-[12px] p-4 mb-4 border border-border">
            <p className="text-[0.8125rem] text-ink-secondary mb-3">
              Envoyez ces identifiants à <strong className="text-ink">{createdUser.username}</strong> :
            </p>
            <div className="text-[0.8125rem] font-mono bg-surface-raised rounded-[10px] p-3 border border-border">
              <p className="text-ink-secondary">Email : <span className="text-ink font-medium">{createdUser.email}</span></p>
              <p className="text-ink-secondary mt-1">Mot de passe : <span className="text-ink font-medium">{createdUser.password}</span></p>
              <p className="text-ink-secondary mt-1">Rôle : <span className="text-ink font-medium">{createdUser.role}</span></p>
            </div>
          </div>

          <Button
            text={copied ? "Copié !" : "Copier les identifiants"}
            variant="primary"
            icon={copied ? Check : Copy}
            onClick={copyCredentials}
            className="w-full py-3"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="w-full max-w-[400px] bg-surface-raised rounded-[16px] shadow-elevated p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-muted text-primary flex items-center justify-center">
              <UserPlus size={16} strokeWidth={2} />
            </div>
            <h2 className="text-[1.125rem] font-semibold text-ink">
              Nouvel utilisateur
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-ink-muted hover:text-ink p-1.5 rounded-[8px] hover:bg-surface transition-all"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {errors.global && (
          <div className="mb-4 rounded-[10px] bg-red-50 text-error text-[0.8125rem] font-medium px-4 py-3">
            {errors.global}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-1.5">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              className="w-full border border-border rounded-[10px] px-4 py-2.5 text-[0.9375rem] text-ink bg-surface-raised focus:outline-none focus:border-primary focus:shadow-lifted transition-all duration-200 placeholder:text-ink-muted"
              placeholder="Jean Dupont"
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({ ...f, username: e.target.value }))
              }
            />
            {errors.username && (
              <p className="text-error text-[0.75rem] font-medium mt-1.5">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-1.5">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-border rounded-[10px] px-4 py-2.5 text-[0.9375rem] text-ink bg-surface-raised focus:outline-none focus:border-primary focus:shadow-lifted transition-all duration-200 placeholder:text-ink-muted"
              placeholder="jean@restaurant.com"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
            {errors.email && (
              <p className="text-error text-[0.75rem] font-medium mt-1.5">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-1.5">
              Mot de passe
            </label>
            <input
              type="password"
              className="w-full border border-border rounded-[10px] px-4 py-2.5 text-[0.9375rem] text-ink bg-surface-raised focus:outline-none focus:border-primary focus:shadow-lifted transition-all duration-200 placeholder:text-ink-muted"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
            />
            {errors.password && (
              <p className="text-error text-[0.75rem] font-medium mt-1.5">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-1.5">
              Rôle
            </label>
            <select
              className="w-full border border-border rounded-[10px] px-4 py-2.5 text-[0.9375rem] text-ink bg-surface-raised focus:outline-none focus:border-primary focus:shadow-lifted transition-all duration-200"
              value={form.roleId}
              onChange={(e) =>
                setForm((f) => ({ ...f, roleId: parseInt(e.target.value) }))
              }
            >
              {ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-3 text-[0.9375rem] text-ink-secondary cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 rounded-[6px] border-border text-primary focus:ring-primary focus:ring-offset-0"
              checked={form.mustChangePassword}
              onChange={(e) =>
                setForm((f) => ({ ...f, mustChangePassword: e.target.checked }))
              }
            />
            Forcer le changement de mot de passe à la connexion
          </label>

          <div className="flex items-center justify-end gap-3 mt-2 pt-2 border-t border-border">
            <Button
              text="Annuler"
              variant="ghost"
              onClick={handleClose}
            />
            <Button
              text={loading ? "Création..." : "Créer l'utilisateur"}
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
