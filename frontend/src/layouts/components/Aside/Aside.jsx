import {
  LayoutDashboard,
  ClipboardList,
  Calendar,
  BarChart3,
  Users,
  Settings,
  CircleHelp,
  LogOut,
} from "lucide-react";
import AsideItem from "./AsideItem";
import { useAuth } from "../../../features/auth/hooks/useAuth";

const general = [
  { label: "Settings", icon: Settings, route: "/settings" },
  { label: "Help", icon: CircleHelp, route: "/help" },
  {
    label: "Logout",
    icon: LogOut,
    route: "/logout",
    danger: true,
    isLogout: true,
  },
];

export default function Aside() {
  const { user } = useAuth();
  const userRole = user?.role?.name;
  const canManageUsers = ["Admin", "Owner", "Manager"].includes(userRole);

  const menu = [
    { label: "Dashboard", icon: LayoutDashboard, route: "/", isExact: true },
    { label: "Tasks", icon: ClipboardList, route: "/tasks" },
    { label: "Calendar", icon: Calendar, route: "/calendar" },
    { label: "Analytics", icon: BarChart3, route: "/analytics" },
    ...(canManageUsers ? [{ label: "Team", icon: Users, route: "/users" }] : []),
  ];

  return (
    <aside className="w-65 h-full bg-[#efefef] rounded-4xl p-6 flex flex-col">
      <div className="w-full flex items-center justify-center mb-8 px-2">
        <p className="bg-primary rounded-full font-bold text-white p-4 size-2 flex items-center justify-center text-xl">
          G
        </p>
        <span className="hidden md:block text-[22px] tracking-tight">
          <strong>ESTO-RESTO</strong>
        </span>
      </div>

      <div className="flex flex-col">
        <nav className="flex flex-col gap-2">
          {menu.map((item) => (
            <AsideItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              navigateTo={item.route}
              isExact={item.isExact} // On passe l'info si c'est la racine
            />
          ))}
        </nav>
      </div>

      <div className="mt-auto">
        <p className="text-gray-400 text-[11px] font-bold mb-4 uppercase tracking-wider px-4">
          General
        </p>
        <nav className="flex flex-col gap-2">
          {general.map((item) => (
            <AsideItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              navigateTo={item.route}
              danger={item.danger}
              isLogout={item.isLogout}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
}
