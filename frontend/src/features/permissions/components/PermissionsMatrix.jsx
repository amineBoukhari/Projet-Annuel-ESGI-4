import { Check, Minus } from "lucide-react";
import { groupPermissionsByCategory, getCategoryMeta } from "./PermissionBadge";

const ROLE_NAMES = ["Admin", "Owner", "Manager", "Employee"];

export default function PermissionsMatrix({ roles, allPermissions }) {
  const grouped = groupPermissionsByCategory(allPermissions);

  const hasPermission = (role, permName) => {
    return role.permissions?.some((p) => p.name === permName) ?? false;
  };

  const getRoleByName = (name) => roles.find((r) => r.name === name);

  return (
    <div className="overflow-hidden rounded-[16px] border border-border bg-surface-raised shadow-ambient">
      <div className="overflow-x-auto">
        <table className="min-w-full text-[0.8125rem]">
          <thead className="bg-surface sticky top-0 z-10">
            <tr>
              <th className="px-5 py-3.5 text-left text-[0.75rem] font-semibold text-ink-secondary uppercase tracking-wider w-48">
                Permission
              </th>
              {ROLE_NAMES.map((name) => (
                <th
                  key={name}
                  className="px-4 py-3.5 text-center text-[0.75rem] font-semibold text-ink-secondary uppercase tracking-wider"
                >
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Object.entries(grouped).map(([cat, perms]) => {
              const { label, className } = getCategoryMeta(cat);
              return [
                <tr key={`header-${cat}`} className="bg-surface">
                  <td colSpan={5} className="px-5 py-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold ${className}`}>
                      {label}
                    </span>
                  </td>
                </tr>,
                ...perms.map((perm) => (
                  <tr key={perm.id} className="hover:bg-surface transition-colors duration-150">
                    <td className="px-5 py-3 text-[0.8125rem] font-medium text-ink-secondary">
                      {perm.name}
                    </td>
                    {ROLE_NAMES.map((name) => {
                      const role = getRoleByName(name);
                      const active = role ? hasPermission(role, perm.name) : false;
                      return (
                        <td key={name} className="px-4 py-3 text-center">
                          {active ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-50 text-success mx-auto">
                              <Check size={13} strokeWidth={2.5} />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-surface text-ink-muted mx-auto">
                              <Minus size={13} strokeWidth={2} />
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                )),
              ];
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
