import { useState } from "react";
import { ShieldCheck, X, Save } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button";
import permissionService from "../../../services/permissionService";
import { groupPermissionsByCategory, getCategoryMeta } from "./PermissionBadge";

const ROLE_STYLES = {
  Admin:    "bg-purple-50 text-purple-700",
  Owner:    "bg-primary-muted text-primary",
  Manager:  "bg-blue-50 text-info",
  Employee: "bg-surface text-ink-secondary",
};

export default function RolePermissionsPanel({ role, allPermissions, onClose, onSaved }) {
  const initialIds = new Set(role.permissions?.map((p) => p.id) || []);
  const [selectedIds, setSelectedIds] = useState(new Set(initialIds));
  const [saving, setSaving] = useState(false);

  const toggle = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await permissionService.updateRolePermissions(role.id, [...selectedIds]);
      toast.success(`Permissions de ${role.name} mises à jour`);
      onSaved();
    } catch (err) {
      toast.error(err.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const grouped = groupPermissionsByCategory(allPermissions);
  const changed = [...selectedIds].sort().join() !== [...initialIds].sort().join();

  return (
    <div className="bg-surface-raised rounded-[16px] border border-border shadow-elevated overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-muted text-primary flex items-center justify-center">
            <ShieldCheck size={16} strokeWidth={2} />
          </div>
          <div>
            <p className="text-[1rem] font-semibold text-ink">
              Permissions —{" "}
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold ${ROLE_STYLES[role.name] || "bg-surface text-ink-secondary"}`}>
                {role.name}
              </span>
            </p>
            <p className="text-[0.8125rem] text-ink-muted mt-0.5">
              {selectedIds.size} permission(s) activée(s) sur {allPermissions.length}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-ink-muted hover:text-ink p-1.5 rounded-[8px] hover:bg-surface transition-all"
        >
          <X size={18} strokeWidth={2} />
        </button>
      </div>

      <div className="p-5 max-h-[60vh] overflow-y-auto space-y-5">
        {Object.entries(grouped).map(([cat, perms]) => {
          const { label, className } = getCategoryMeta(cat);
          return (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold ${className}`}>
                  {label}
                </span>
                <span className="text-[0.75rem] text-ink-muted">
                  {perms.filter((p) => selectedIds.has(p.id)).length}/{perms.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {perms.map((perm) => {
                  const isActive = selectedIds.has(perm.id);
                  return (
                    <button
                      key={perm.id}
                      onClick={() => toggle(perm.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] border text-left transition-all duration-150 ${
                        isActive
                          ? "border-primary bg-primary-muted"
                          : "border-border bg-surface hover:bg-surface-raised"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center flex-shrink-0 transition-all ${
                        isActive ? "bg-primary border-primary" : "border-border-strong bg-surface-raised"
                      }`}>
                        {isActive && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-[0.8125rem] font-medium ${isActive ? "text-primary" : "text-ink-secondary"}`}>
                        {perm.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-surface">
        <p className="text-[0.8125rem] text-ink-muted">
          {changed ? "Modifications non sauvegardées" : "Aucune modification"}
        </p>
        <div className="flex items-center gap-2">
          <Button text="Annuler" variant="ghost" onClick={onClose} />
          <Button
            text={saving ? "Sauvegarde..." : "Sauvegarder"}
            variant="primary"
            icon={Save}
            onClick={handleSave}
            disabled={!changed || saving}
          />
        </div>
      </div>
    </div>
  );
}
