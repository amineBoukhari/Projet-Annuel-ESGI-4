import { useEffect, useState } from "react";
import { RefreshCw, Shield, LayoutGrid } from "lucide-react";
import toast from "react-hot-toast";
import permissionService from "../services/permissionService";
import RolesTable from "../features/permissions/components/RolesTable";
import RolePermissionsPanel from "../features/permissions/components/RolePermissionsPanel";
import PermissionsMatrix from "../features/permissions/components/PermissionsMatrix";
import Button from "../components/ui/Button";

const VIEWS = [
  { id: "roles", label: "Par rôle", icon: Shield },
  { id: "matrix", label: "Matrice", icon: LayoutGrid },
];

export default function Permissions() {
  const [roles, setRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [view, setView] = useState("roles");

  const load = async () => {
    setLoading(true);
    try {
      const [rolesData, permsData] = await Promise.all([
        permissionService.fetchAllRoles(),
        permissionService.fetchAllPermissions(),
      ]);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
      setAllPermissions(Array.isArray(permsData) ? permsData : []);
    } catch {
      toast.error("Impossible de charger les permissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleEditRole = (role) => {
    setSelectedRole((prev) => (prev?.id === role.id ? null : role));
    setView("roles");
  };

  const handleSaved = async () => {
    await load();
    setSelectedRole(null);
  };

  const totalPerms = allPermissions.length;
  const adminCount = roles.find((r) => r.name === "Admin")?.permissions?.length ?? 0;
  const employeeCount = roles.find((r) => r.name === "Employee")?.permissions?.length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">Permissions</h1>
          <p className="text-[0.9375rem] text-ink-muted mt-1">
            Gérez les permissions associées à chaque rôle.
          </p>
        </div>
        <Button text="Actualiser" variant="ghost" icon={RefreshCw} onClick={load} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center">
              <Shield size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">Permissions totales</span>
          </div>
          <p className="text-[1.5rem] font-semibold text-ink">{totalPerms}</p>
        </div>
        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[8px] bg-purple-50 text-purple-700 flex items-center justify-center">
              <Shield size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">Admin</span>
          </div>
          <p className="text-[1.5rem] font-semibold text-ink">{adminCount}</p>
        </div>
        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center">
              <Shield size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">Employee</span>
          </div>
          <p className="text-[1.5rem] font-semibold text-ink">{employeeCount}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-border pb-4">
        {VIEWS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setView(id); setSelectedRole(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-[0.875rem] font-medium transition-all duration-150 ${
              view === id
                ? "bg-primary-muted text-primary"
                : "text-ink-secondary hover:bg-surface hover:text-ink"
            }`}
          >
            <Icon size={15} strokeWidth={2} />
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-ink-muted text-[0.9375rem]">
          Chargement...
        </div>
      ) : (
        <>
          {view === "roles" && (
            <div className="space-y-4">
              <RolesTable
                roles={roles}
                onEditRole={handleEditRole}
                selectedRoleId={selectedRole?.id}
              />
              {selectedRole && (
                <RolePermissionsPanel
                  role={selectedRole}
                  allPermissions={allPermissions}
                  onClose={() => setSelectedRole(null)}
                  onSaved={handleSaved}
                />
              )}
            </div>
          )}

          {view === "matrix" && (
            <PermissionsMatrix roles={roles} allPermissions={allPermissions} />
          )}
        </>
      )}
    </div>
  );
}
