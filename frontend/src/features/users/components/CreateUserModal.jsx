import { useState } from "react";
import { X, Copy, Check } from "lucide-react";

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
    else if (!/^[^\s@]+@[^\s@\.]+\.[^\s@]+$/.test(form.email))
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-green-700">
              Utilisateur créé !
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Envoyez ces identifiants à <strong>{createdUser.username}</strong> :
            </p>
            <div className="text-sm font-mono bg-white rounded-lg p-3 border border-gray-200">
              <p>Email : {createdUser.email}</p>
              <p>Mot de passe : {createdUser.password}</p>
              <p>Rôle : {createdUser.role}</p>
            </div>
          </div>

          <button
            onClick={copyCredentials}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copié !" : "Copier les identifiants"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Nouvel utilisateur
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {errors.global && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-3 py-2">
            {errors.global}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({ ...f, username: e.target.value }))
              }
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Rôle
            </label>
            <select
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
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

          <label className="flex items-center gap-2 text-sm text-gray-700 mt-1">
            <input
              type="checkbox"
              className="rounded border-gray-300"
              checked={form.mustChangePassword}
              onChange={(e) =>
                setForm((f) => ({ ...f, mustChangePassword: e.target.checked }))
              }
            />
            Forcer le changement de mot de passe à la connexion
          </label>

          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Création..." : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
