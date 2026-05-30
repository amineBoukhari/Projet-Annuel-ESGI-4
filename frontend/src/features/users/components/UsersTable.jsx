import { useState } from "react";
import { Trash2, ShieldCheck, Shield } from "lucide-react";

const ROLES = [
  { id: 1, name: "Admin", color: "bg-purple-50 text-purple-700" },
  { id: 2, name: "Owner", color: "bg-primary-muted text-primary" },
  { id: 3, name: "Manager", color: "bg-blue-50 text-info" },
  { id: 4, name: "Employee", color: "bg-surface text-ink-secondary" },
];

export default function UsersTable({ users, onDelete, onUpdateRole }) {
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleChange = async (userId) => {
    if (!selectedRole) return;
    await onUpdateRole(userId, parseInt(selectedRole));
    setEditingRoleId(null);
    setSelectedRole("");
  };

  const getRoleStyle = (roleName) => {
    const role = ROLES.find((r) => r.name === roleName);
    return role?.color || "bg-surface text-ink-secondary";
  };

  return (
    <div className="overflow-hidden rounded-[16px] border border-border bg-surface-raised shadow-ambient">
      <div className="overflow-x-auto">
        <table className="min-w-full text-[0.9375rem]">
          <thead className="bg-surface">
            <tr>
              {["Nom", "Email", "Rôle", ""].map((header) => (
                <th
                  key={header}
                  className="px-5 py-3.5 text-left text-[0.75rem] font-semibold text-ink-secondary uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-surface transition-colors duration-150"
              >
                <td className="px-5 py-4 font-medium text-ink">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-muted text-primary flex items-center justify-center text-[0.75rem] font-bold">
                      {user.username?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    {user.username}
                  </div>
                </td>
                <td className="px-5 py-4 text-ink-secondary">{user.email}</td>
                <td className="px-5 py-4">
                  {editingRoleId === user.id ? (
                    <div className="flex items-center gap-2">
                      <select
                        className="border border-border rounded-[10px] px-3 py-1.5 text-[0.8125rem] bg-surface-raised focus:outline-none focus:border-primary focus:shadow-lifted transition-all"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                      >
                        <option value="">Choisir...</option>
                        {ROLES.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleRoleChange(user.id)}
                        className="text-success hover:text-green-700 p-1.5 rounded-[8px] hover:bg-green-50 transition-all"
                        title="Valider"
                      >
                        <ShieldCheck size={16} strokeWidth={2} />
                      </button>
                    </div>
                  ) : (
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.75rem] font-semibold ${getRoleStyle(user.role?.name)}`}>
                      {user.role?.name || "—"}
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => {
                        setEditingRoleId(user.id);
                        setSelectedRole(String(user.roleId || ""));
                      }}
                      className="text-ink-muted hover:text-ink p-2 rounded-[8px] hover:bg-surface transition-all duration-150"
                      title="Modifier le rôle"
                    >
                      <Shield size={16} strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="text-error hover:text-red-700 p-2 rounded-[8px] hover:bg-red-50 transition-all duration-150"
                      title="Supprimer"
                    >
                      <Trash2 size={16} strokeWidth={2} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-12 text-center text-ink-muted text-[0.9375rem]"
                >
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
