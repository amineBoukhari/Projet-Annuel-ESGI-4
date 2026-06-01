import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import userService from "../services/userService";
import ContentContainer from "../components/ui/Content/ContentContainer";

const ROLE_OPTIONS = ["Owner", "Manager", "Employee"];

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      setError(null);
      const result = await userService.getUserById(id);
      if (result?.status === "error" || result?.error) {
        setError(result.error || result.message || "Impossible de charger l'utilisateur.");
        setUser(null);
      } else {
        setUser(result);
        setSelectedRole(result.role?.name || "Employee");
      }
      setLoading(false);
    };
    loadUser();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      return;
    }

    const result = await userService.deleteUser(id);
    if (result?.status === "error" || result?.error) {
      setError(result.error || result.message || "Erreur lors de la suppression.");
      return;
    }

    navigate("/users");
  };

  const handleRoleUpdate = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const result = await userService.updateUserRole(id, selectedRole);
    if (result?.status === "error" || result?.error) {
      setError(result.error || result.message || "Erreur lors de la mise à jour du rôle.");
      return;
    }

    setSuccess(result.message || "Rôle mis à jour avec succès.");
    setUser((current) => ({ ...current, role: { name: selectedRole } }));
    setModalOpen(false);
  };

  return (
    <>
      <ContentContainer x={3}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Utilisateur</h1>
              <p className="text-sm text-slate-500 mt-2">Détails et actions pour cet utilisateur.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/users"
                className="rounded-2xl border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100"
              >
                Retour
              </Link>
              <Link
                to={`/users/${id}/edit`}
                className="rounded-2xl bg-primary px-4 py-2 text-white hover:opacity-90"
              >
                Modifier
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-2xl border border-red-300 bg-red-50 px-4 py-2 text-red-700 hover:bg-red-100"
              >
                Supprimer
              </button>
            </div>
          </div>

          {error && <p className="text-red-600 bg-red-50 rounded-2xl p-3">{error}</p>}
          {success && <p className="text-emerald-700 bg-emerald-50 rounded-2xl p-3">{success}</p>}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Informations</h2>
              {loading ? (
                <p className="text-slate-600">Chargement...</p>
              ) : user ? (
                <div className="space-y-3 text-slate-700">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Nom</p>
                    <p className="mt-1 text-lg font-medium text-slate-900">{user.username}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Email</p>
                    <p className="mt-1 text-lg font-medium text-slate-900">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Rôle</p>
                    <p className="mt-1 text-lg font-medium text-slate-900">{user.role?.name || "Non défini"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Créé le</p>
                    <p className="mt-1 text-lg font-medium text-slate-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-600">Utilisateur introuvable.</p>
              )}
            </div>

            <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Actions</h2>
              <p className="text-sm text-slate-500 mb-4">
                Vous pouvez modifier le rôle de cet utilisateur sans changer son profil.
              </p>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-white hover:opacity-90"
              >
                Mettre à jour le rôle
              </button>
            </div>
          </div>
        </div>
      </ContentContainer>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-slate-900">Modifier le rôle</h3>
                <p className="text-sm text-slate-500 mt-1">Choisissez un nouveau rôle pour l'utilisateur.</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                Fermer
              </button>
            </div>
            <form onSubmit={handleRoleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="roleSelect">
                  Nouveau rôle
                </label>
                <select
                  id="roleSelect"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  value={selectedRole}
                  onChange={(event) => setSelectedRole(event.target.value)}
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="rounded-2xl bg-primary px-5 py-3 text-white hover:opacity-90">
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-2xl border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-100"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
