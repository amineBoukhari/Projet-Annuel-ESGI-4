import { MapPin, Pencil, Trash2, ChevronRight } from "lucide-react";

export default function RestaurantsTable({ restaurants, onEdit, onDelete, onView, isAdmin, canEdit = isAdmin }) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-border bg-surface-raised shadow-ambient">
      <div className="overflow-x-auto">
        <table className="min-w-full text-[0.9375rem]">
          <thead className="bg-surface">
            <tr>
              {["Restaurant", "Adresse", "Membres", ""].map((h) => (
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
            {restaurants.map((r) => (
              <tr
                key={r.id}
                className="hover:bg-surface transition-colors duration-150 cursor-pointer"
                onClick={() => onView(r)}
              >
                <td className="px-5 py-4 font-medium text-ink">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[10px] bg-primary-muted text-primary flex items-center justify-center text-[0.75rem] font-bold flex-shrink-0">
                      {r.name?.charAt(0)?.toUpperCase() || "R"}
                    </div>
                    <span>{r.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-ink-secondary">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} strokeWidth={2} className="text-ink-muted flex-shrink-0" />
                    {r.adress}
                  </div>
                </td>
                <td className="px-5 py-4 text-ink-secondary">
                  <span className="text-[0.9375rem] font-semibold text-ink">{r.users?.length ?? 0}</span>
                  <span className="text-[0.8125rem] text-ink-muted ml-1">membre(s)</span>
                </td>
                <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onView(r)}
                      className="text-ink-muted hover:text-ink p-2 rounded-[8px] hover:bg-surface transition-all"
                      title="Voir les détails"
                    >
                      <ChevronRight size={16} strokeWidth={2} />
                    </button>
                    {canEdit && (
                      <button
                        onClick={() => onEdit(r)}
                        className="text-ink-muted hover:text-ink p-2 rounded-[8px] hover:bg-surface transition-all"
                        title="Modifier"
                      >
                        <Pencil size={15} strokeWidth={2} />
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => onDelete(r.id)}
                        className="text-error hover:text-red-700 p-2 rounded-[8px] hover:bg-red-50 transition-all"
                        title="Supprimer"
                      >
                        <Trash2 size={15} strokeWidth={2} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {restaurants.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-ink-muted text-[0.9375rem]">
                  Aucun restaurant trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
