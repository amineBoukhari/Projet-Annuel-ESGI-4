import { useEffect, useState } from "react";
import { Plus, RefreshCw, Users } from "lucide-react";
import toast from "react-hot-toast";
import UsersTable from "../features/users/components/UsersTable";
import CreateUserModal from "../features/users/components/CreateUserModal";
import userService from "../services/userService";
import Button from "../components/ui/Button";

export default function Users_() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.fetchUsers();
      setUsers(Array.isArray(data) ? data : []);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">Équipe</h1>
          <p className="text-[0.9375rem] text-ink-muted mt-1">
            Gérez les utilisateurs et leurs rôles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            text="Actualiser"
            variant="ghost"
            icon={RefreshCw}
            onClick={loadUsers}
          />
          <Button
            text="Ajouter"
            variant="primary"
            icon={Plus}
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center">
              <Users size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">Total</span>
          </div>
          <p className="text-[1.5rem] font-semibold text-ink">{users.length}</p>
        </div>
        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center">
              <Users size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">Managers</span>
          </div>
          <p className="text-[1.5rem] font-semibold text-ink">
            {users.filter((u) => ["Admin", "Owner", "Manager"].includes(u.role?.name)).length}
          </p>
        </div>
        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center">
              <Users size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">Employés</span>
          </div>
          <p className="text-[1.5rem] font-semibold text-ink">
            {users.filter((u) => u.role?.name === "Employee").length}
          </p>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-40 text-ink-muted text-[0.9375rem]">
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
