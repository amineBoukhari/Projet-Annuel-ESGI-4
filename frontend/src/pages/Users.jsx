import { useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import UsersTable from "../features/users/components/UsersTable";
import CreateUserModal from "../features/users/components/CreateUserModal";
import userService from "../services/userService";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.fetchUsers();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch {
      toast.error("Impossible de charger les utilisateurs");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (userData) => {
    await userService.createUser(userData);
    await loadUsers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await userService.deleteUser(id);
      toast.success("Utilisateur supprimé");
      await loadUsers();
    } catch (err) {
      toast.error(err.message || "Erreur lors de la suppression");
    }
  };

  const handleUpdateRole = async (id, newRoleId) => {
    try {
      await userService.updateUserRole(id, newRoleId);
      toast.success("Rôle mis à jour");
      await loadUsers();
    } catch (err) {
      toast.error(err.message || "Erreur lors de la mise à jour du rôle");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Équipe</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez les utilisateurs et leurs rôles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadUsers}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 border border-gray-200"
          >
            <RefreshCw size={16} />
            Actualiser
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90"
          >
            <Plus size={16} />
            Ajouter
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
          Chargement...
        </div>
      ) : (
        <UsersTable
          users={users}
          onDelete={handleDelete}
          onUpdateRole={handleUpdateRole}
        />
      )}

      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
