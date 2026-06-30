import { Receipt, TrendingUp, Package } from "lucide-react";

export default function QuickActions() {
  const actions = [
    { label: "Nouvelle facture", icon: Receipt, href: "/invoices/new" },
    { label: "Encaissement rapide", icon: TrendingUp, href: "/quick-invoice" },
    { label: "Nouvelle commande", icon: Package, href: "/purchase-orders/new" },
  ];

  return (
    <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
      <h2 className="text-[1.125rem] font-medium text-ink mb-3">
        Actions rapides
      </h2>
      <div className="flex flex-col gap-2">
        {actions.map((action, index) => (
          <a
            key={index}
            href={action.href}
            className="flex items-center gap-3 px-4 py-3 rounded-md border border-border bg-surface-raised text-ink-secondary text-[0.9375rem] font-medium hover:border-primary hover:text-primary hover:shadow-ambient transition-all duration-200"
          >
            <action.icon size={18} strokeWidth={2} />
            {action.label}
          </a>
        ))}
      </div>
    </div>
  );
}
