import { NavLink } from "react-router";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import toast from "react-hot-toast";

export default function AsideItem({
  icon: Icon,
  label,
  navigateTo,
  isExact,
  danger = false,
  isLogout = false,
}) {
  const { logout } = useAuth();

  if (isLogout) {
    return (
      <button
        onClick={() => {
          logout();
          toast.success("Déconnecté avec succès");
        }}
        className="
          flex items-center gap-4 px-4 py-3 rounded-[10px] transition-all duration-150 w-full text-left
          text-ink-muted hover:bg-surface-raised hover:text-ink hover:cursor-pointer
          hover:shadow-ambient
        "
      >
        <Icon size={20} strokeWidth={2} />
        <span className="font-medium text-[0.8125rem]">{label}</span>
      </button>
    );
  }

  return (
    <NavLink
      to={navigateTo}
      end={isExact}
      className={({ isActive }) => `
        flex items-center gap-4 px-4 py-3 rounded-[10px] transition-all duration-150 w-full text-left
        ${
          isActive
            ? "bg-surface-raised text-ink shadow-ambient font-medium"
            : "text-ink-muted hover:bg-surface-raised hover:text-ink hover:shadow-ambient"
        }
      `}
    >
      <Icon size={20} strokeWidth={2} className={danger ? "text-error" : ""} />
      <span className="font-medium text-[0.8125rem]">{label}</span>
    </NavLink>
  );
}
