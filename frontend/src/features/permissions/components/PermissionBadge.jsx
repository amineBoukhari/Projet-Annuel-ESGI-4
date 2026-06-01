const CATEGORY_STYLES = {
  user:     { label: "Utilisateurs",    className: "bg-primary-muted text-primary" },
  role:     { label: "Rôles",           className: "bg-purple-50 text-purple-700" },
  invoice:  { label: "Factures",        className: "bg-blue-50 text-info" },
  payment:  { label: "Paiements",       className: "bg-green-50 text-success" },
  stock:    { label: "Stock",           className: "bg-amber-50 text-warning" },
  supplier: { label: "Fournisseurs",    className: "bg-orange-50 text-orange-700" },
  planning: { label: "Planning",        className: "bg-pink-50 text-pink-700" },
  report:   { label: "Rapports",        className: "bg-indigo-50 text-indigo-700" },
  restaurant:{ label: "Restaurant",     className: "bg-teal-50 text-teal-700" },
  dashboard:{ label: "Dashboard",       className: "bg-cyan-50 text-cyan-700" },
  alert:    { label: "Alertes",         className: "bg-red-50 text-error" },
  waste:    { label: "Déchets",         className: "bg-lime-50 text-lime-700" },
  default:  { label: "Autre",           className: "bg-surface text-ink-secondary" },
};

export function getCategory(permissionName) {
  const name = permissionName.toLowerCase();
  if (name.includes("user"))        return "user";
  if (name.includes("role"))        return "role";
  if (name.includes("invoice"))     return "invoice";
  if (name.includes("payment"))     return "payment";
  if (name.includes("stock") || name.includes("expiry")) return "stock";
  if (name.includes("supplier"))    return "supplier";
  if (name.includes("planning"))    return "planning";
  if (name.includes("report"))      return "report";
  if (name.includes("restaurant"))  return "restaurant";
  if (name.includes("dashboard"))   return "dashboard";
  if (name.includes("alert"))       return "alert";
  if (name.includes("waste"))       return "waste";
  return "default";
}

export function getCategoryMeta(category) {
  return CATEGORY_STYLES[category] || CATEGORY_STYLES.default;
}

export function groupPermissionsByCategory(permissions) {
  return permissions.reduce((acc, perm) => {
    const cat = getCategory(perm.name);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(perm);
    return acc;
  }, {});
}

export default function PermissionBadge({ name }) {
  const cat = getCategory(name);
  const { className } = getCategoryMeta(cat);
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.75rem] font-semibold ${className}`}>
      {name}
    </span>
  );
}
