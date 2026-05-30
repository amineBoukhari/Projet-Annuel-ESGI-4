import {
  LayoutDashboard,
  Users,
  Settings,
  CircleHelp,
  LogOut,
  Receipt,
  Zap,
  Wallet,
  Truck,
  FileText,
  ShoppingCart,
  Package,
  BarChart3,
} from "lucide-react";
import AsideItem from "./AsideItem";
import { useAuth } from "../../../features/auth/hooks/useAuth";

const general = [
  { label: "Paramètres", icon: Settings, route: "/settings" },
  { label: "Aide", icon: CircleHelp, route: "/help" },
  {
    label: "Déconnexion",
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
    ...(canManageUsers ? [{ label: "Factures", icon: Receipt, route: "/invoices" }] : []),
    ...(canManageUsers ? [{ label: "Encaissement", icon: Zap, route: "/quick-invoice" }] : []),
    ...(canManageUsers ? [{ label: "Commandes", icon: ShoppingCart, route: "/purchase-orders" }] : []),
    ...(canManageUsers ? [{ label: "Réceptions", icon: Truck, route: "/goods-receipts" }] : []),
    ...(canManageUsers ? [{ label: "Achats", icon: FileText, route: "/supplier-invoices" }] : []),
    ...(canManageUsers ? [{ label: "Dépenses", icon: Wallet, route: "/expenses" }] : []),
    { label: "Stocks", icon: Package, route: "/stocks" },
    ...(canManageUsers ? [{ label: "Équipe", icon: Users, route: "/users" }] : []),
  ];

  return (
    <aside className="w-[260px] h-full bg-surface rounded-[24px] p-6 flex flex-col shrink-0">
      {/* Logo */}
      <div className="w-full flex items-center gap-3 mb-10 px-2">
        <div className="bg-primary rounded-full font-bold text-white w-10 h-10 flex items-center justify-center text-xl shrink-0 shadow-ambient">
          G
        </div>
        <span className="text-[20px] tracking-tight font-semibold text-ink">
          Gesto-Resto
        </span>
      </div>

      {/* Main Navigation */}
      <div className="flex flex-col">
        <p className="text-ink-muted text-[11px] font-semibold mb-3 uppercase tracking-wider px-4">
          Menu
        </p>
        <nav className="flex flex-col gap-1">
          {menu.map((item) => (
            <AsideItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              navigateTo={item.route}
              isExact={item.isExact}
            />
          ))}
        </nav>
      </div>

      {/* General */}
      <div className="mt-auto pt-6">
        <p className="text-ink-muted text-[11px] font-semibold mb-3 uppercase tracking-wider px-4">
          Général
        </p>
        <nav className="flex flex-col gap-1">
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
