import { NavLink } from "react-router"; // ou "react-router"
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
          toast.success("successfully disconnected");
        }}
        className={`
          flex items-center gap-4 px-4 py-3 rounded-2xl transition-all w-full text-left
          text-gray-400 hover:bg-white hover:cursor-pointer
          ${danger ? "hover:text-red-600" : "hover:text-black"}
        `}
      >
        <Icon size={22} />
        <span className="font-medium">{label}</span>
      </button>
    );
  }

  return (
    <NavLink
      to={navigateTo}
      end={isExact}
      // Ici, la fonction est acceptée car c'est un composant NavLink
      className={({ isActive }) => `
        flex items-center gap-4 px-4 py-3 rounded-2xl transition-all w-full text-left
        ${
          isActive
            ? "bg-white text-black shadow-sm"
            : `text-gray-400 hover:bg-white ${danger ? "hover:text-red-600" : "hover:text-black"}`
        }
      `}
    >
      <Icon size={22} />
      <span className="font-medium">{label}</span>
    </NavLink>
  );
}
