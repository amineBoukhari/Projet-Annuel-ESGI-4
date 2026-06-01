import { useEffect, useState } from "react";
import { Link } from "react-router";
import userService from "../services/userService";
import ContentContainer from "../components/ui/Content/ContentContainer";

export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError(null);
      const result = await userService.getAllUsers();

      if (result?.status === "error" || result?.error) {
        setError(result.error || result.message || "Impossible de charger les utilisateurs.");
        setUsers([]);
      } else {
        setUsers(Array.isArray(result) ? result : []);
      }
      setLoading(false);
    };

    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      return;
    }

    const result = await userService.deleteUser(id);
    if (result?.status === "error" || result?.error) {
      setError(result.error || result.message || "Erreur lors de la suppression.");
      return;
    }

    setUsers((current) => current.filter((user) => user.id !== id));
  };

  return (
    <>
      <ContentContainer x={3}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Gestion des utilisateurs</h1>
              <p className="text-sm text-slate-500 mt-2">
                Liste complète des utilisateurs avec accès aux détails, à l'édition et au changement de rôle.
              </p>
            </div>
            <Link
              to="/users/create"
              className="inline-flex items-center justify-center bg-primary px-5 py-3 rounded-2xl text-white font-semibold hover:opacity-90"
            >
              Créer un utilisateur
            </Link>
          </div>

          {error && (
            <p className="text-red-600 bg-red-50 rounded-2xl p-3">{error}</p>
          )}

          <div className="overflow-x-auto rounded-3xl bg-slate-50 p-4">
            {loading ? (
              <p className="text-slate-600">Chargement...</p>
            ) : users.length === 0 ? (
              <p className="text-slate-600">Aucun utilisateur trouvé.</p>
            ) : (
              <table className="min-w-full text-left text-sm text-slate-700">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-3 px-4">Nom</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Rôle</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-100">
                      <td className="py-4 px-4 font-medium text-slate-900">{user.username || "-"}</td>
                      <td className="py-4 px-4">{user.email || "-"}</td>
                      <td className="py-4 px-4">{user.role?.name || "Non défini"}</td>
                      <td className="py-4 px-4 space-x-2">
                        <Link
                          to={`/users/${user.id}`}
                          className="inline-flex rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          Voir
                        </Link>
                        <Link
                          to={`/users/${user.id}/edit`}
                          className="inline-flex rounded-full border border-primary bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/20"
                        >
                          Modifier
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(user.id)}
                          className="inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </ContentContainer>
    </>
  );
}
