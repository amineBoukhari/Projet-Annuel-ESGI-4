import { Shield } from "lucide-react";

const ROLE_STYLES = {
  Admin:    "bg-purple-50 text-purple-700",
  Owner:    "bg-primary-muted text-primary",
  Manager:  "bg-blue-50 text-info",
  Employee: "bg-surface text-ink-secondary",
};

export default function RolesTable({ roles, onEditRole, selectedRoleId }) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-border bg-surface-raised shadow-ambient">
      <div className="overflow-x-auto">
        <table className="min-w-full text-[0.9375rem]">
          <thead className="bg-surface">
            <tr>
              {["Rôle", "Permissions", ""].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3.5 text-left text-[0.75rem] font-semibold text-ink-secondary uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {roles.map((role) => (
              <tr
                key={role.id}
                className={`transition-colors duration-150 ${
                  selectedRoleId === role.id ? "bg-primary-muted" : "hover:bg-surface"
                }`}
              >
                <td className="px-5 py-4 font-medium text-ink">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface text-ink-muted flex items-center justify-center">
                      <Shield size={15} strokeWidth={2} />
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.75rem] font-semibold ${ROLE_STYLES[role.name] || "bg-surface text-ink-secondary"}`}>
                      {role.name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-ink-secondary">
                  <span className="text-[0.9375rem] font-semibold text-ink">
                    {role.permissions?.length ?? 0}
                  </span>
                  <span className="text-[0.8125rem] text-ink-muted ml-1">permission(s)</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => onEditRole(role)}
                      className={`flex items-center gap-2 text-[0.8125rem] font-medium px-3 py-1.5 rounded-[8px] transition-all duration-150 ${
                        selectedRoleId === role.id
                          ? "bg-primary text-white"
                          : "text-primary hover:bg-primary-muted"
                      }`}
                    >
                      <Shield size={14} strokeWidth={2} />
                      Gérer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
