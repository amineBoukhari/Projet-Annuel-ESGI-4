import { useState } from "react";
import { X, MapPin, Users, Calendar, Plus } from "lucide-react";
import AddMemberModal from "./AddMemberModal";

const ROLE_STYLES = {
  Admin:    "bg-purple-50 text-purple-700",
  Owner:    "bg-primary-muted text-primary",
  Manager:  "bg-blue-50 text-info",
  Employee: "bg-surface text-ink-secondary",
};

export default function RestaurantDetailPanel({ restaurant, onClose, isAdmin, onMemberAdded }) {
  const [showAddMember, setShowAddMember] = useState(false);

  if (!restaurant) return null;

  const users = restaurant.users || [];
  const managers = users.filter((u) => ["Admin", "Owner", "Manager"].includes(u.role?.name));
  const employees = users.filter((u) => u.role?.name === "Employee");

  return (
    <div className="bg-surface-raised rounded-[16px] border border-border shadow-elevated overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[12px] bg-primary-muted text-primary flex items-center justify-center text-[1rem] font-bold">
            {restaurant.name?.charAt(0)?.toUpperCase() || "R"}
          </div>
          <div>
            <p className="text-[1rem] font-semibold text-ink">{restaurant.name}</p>
            <div className="flex items-center gap-1 text-[0.8125rem] text-ink-muted mt-0.5">
              <MapPin size={12} strokeWidth={2} />
              {restaurant.adress}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-ink-muted hover:text-ink p-1.5 rounded-[8px] hover:bg-surface transition-all"
        >
          <X size={18} strokeWidth={2} />
        </button>
      </div>

      <div className="p-5 space-y-5 max-h-[60vh] overflow-y-auto">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface rounded-[12px] p-3 text-center">
            <p className="text-[1.25rem] font-semibold text-ink">{users.length}</p>
            <p className="text-[0.75rem] text-ink-muted mt-0.5">Total membres</p>
          </div>
          <div className="bg-surface rounded-[12px] p-3 text-center">
            <p className="text-[1.25rem] font-semibold text-ink">{managers.length}</p>
            <p className="text-[0.75rem] text-ink-muted mt-0.5">Managers</p>
          </div>
          <div className="bg-surface rounded-[12px] p-3 text-center">
            <p className="text-[1.25rem] font-semibold text-ink">{employees.length}</p>
            <p className="text-[0.75rem] text-ink-muted mt-0.5">Employés</p>
          </div>
        </div>

        {isAdmin && (
          <div>
            <p className="text-[0.75rem] font-semibold text-ink-secondary uppercase tracking-wider mb-3">
              Informations admin
            </p>
            <div className="bg-surface rounded-[12px] p-4 space-y-2 border border-border">
              <div className="flex items-center justify-between text-[0.8125rem]">
                <span className="text-ink-muted">ID</span>
                <span className="font-mono text-ink text-[0.75rem] bg-surface-raised px-2 py-0.5 rounded-[6px] border border-border">
                  {restaurant.id}
                </span>
              </div>
              <div className="flex items-center justify-between text-[0.8125rem]">
                <span className="text-ink-muted flex items-center gap-1.5">
                  <Calendar size={12} strokeWidth={2} /> Créé le
                </span>
                <span className="text-ink">
                  {restaurant.createdAt
                    ? new Date(restaurant.createdAt).toLocaleDateString("fr-FR")
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[0.75rem] font-semibold text-ink-secondary uppercase tracking-wider">
              Membres ({users.length})
            </p>
            <button
              onClick={() => setShowAddMember(true)}
              className="flex items-center gap-1 text-[0.8125rem] font-medium text-primary hover:text-primary-dark transition-colors"
            >
              <Plus size={14} strokeWidth={2} />
              Ajouter
            </button>
          </div>
          {users.length === 0 ? (
            <p className="text-[0.8125rem] text-ink-muted text-center py-4">Aucun membre</p>
          ) : (
            <div className="space-y-2">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] bg-surface"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-muted text-primary flex items-center justify-center text-[0.75rem] font-bold flex-shrink-0">
                    {u.username?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.875rem] font-medium text-ink truncate">{u.username}</p>
                    <p className="text-[0.75rem] text-ink-muted truncate">{u.email}</p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.7rem] font-semibold flex-shrink-0 ${ROLE_STYLES[u.role?.name] || "bg-surface text-ink-secondary"}`}>
                    {u.role?.name || "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddMemberModal
        isOpen={showAddMember}
        onClose={() => setShowAddMember(false)}
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
        onCreated={() => {
          setShowAddMember(false);
          if (onMemberAdded) onMemberAdded();
        }}
      />
    </div>
  );
}
