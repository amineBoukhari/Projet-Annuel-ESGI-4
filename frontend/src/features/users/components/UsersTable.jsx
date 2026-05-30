import { useState } from "react";
import { Trash2, ShieldCheck } from "lucide-react";

const ROLES = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Owner" },
  { id: 3, name: "Manager" },
  { id: 4, name: "Employee" },
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

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
          <tr>
            <th className="px-4 py-3 text-left">Nom</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Rôle</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900">
                {user.username}
              </td>
              <td className="px-4 py-3 text-gray-600">{user.email}</td>
              <td className="px-4 py-3">
                {editingRoleId === user.id ? (
                  <div className="flex items-center gap-2">
                    <select
                      className="border rounded-lg px-2 py-1 text-xs"
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
                      className="text-green-600 hover:text-green-700"
                      title="Valider"
                    >
                      <ShieldCheck size={16} />
                    </button>
                  </div>
                ) : (
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                    {user.role?.name || "—"}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingRoleId(user.id);
                      setSelectedRole(String(user.roleId || ""));
                    }}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
                    title="Modifier le rôle"
                  >
                    <ShieldCheck size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-8 text-center text-gray-400 text-sm"
              >
                Aucun utilisateur trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
