import { useEffect, useState } from "react";
import { Check, CreditCard, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import subscriptionService from "../services/subscriptionService";
import Button from "../components/ui/Button";

const PLANS = [
  {
    name: "Basic",
    price: "29€",
    period: "/ mois",
    priceId: import.meta.env.VITE_STRIPE_PRICE_BASIC,
    features: [
      "1 restaurant",
      "Gestion des stocks",
      "Factures clients",
      "Commandes fournisseurs",
      "Jusqu'à 5 utilisateurs",
    ],
  },
  {
    name: "Pro ( Comming Soon )",
    price: "79€",
    period: "/ mois",
    priceId: import.meta.env.VITE_STRIPE_PRICE_PRO,
    features: [
      "Restaurants illimités",
      "Gestion des stocks avancée",
      "Factures clients",
      "Commandes fournisseurs",
      "Utilisateurs illimités",
      "Rapports & analytiques",
      "Support prioritaire",
    ],
    highlighted: true,
  },
];

export default function Subscription() {
  const [status, setStatus] = useState(null);

  const [checkoutLoading, setCheckoutLoading] = useState(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
     async function loadStatus() {
      try {
        const data = await subscriptionService.fetchSubscriptionStatus();
        setStatus(data);
      } catch {
        toast.error("Impossible de charger le statut de l'abonnement");
      } 
    };
    loadStatus();
  }, []);

  async function handleSubscribe(priceId) {
    if (!priceId) {
      toast.error("Plan non configuré");
      return;
    }
    setCheckoutLoading(priceId);
    try {
      const data = await subscriptionService.createCheckoutSession(priceId);
      window.location.href = data.url;
    } catch (err) {
      toast.error(err.message);
      setCheckoutLoading(null);
    }
  };

  async function handleManageBilling() {
    setPortalLoading(true);
    try {
      const data = await subscriptionService.createPortalSession();
      window.location.href = data.url;
    } catch (err) {
      toast.error(err.message);
      setPortalLoading(false);
    }
  };

  const isActive = status?.subscriptionStatus === "active" || status?.subscriptionStatus === "trialing";



  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-ink mb-1">Abonnement</h1>
        <p className="text-ink-muted text-sm">Gérez votre plan et votre facturation.</p>
      </div>

      {isActive && (
        <div className="bg-surface rounded-[16px] p-6 mb-8 flex items-center justify-between shadow-ambient">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 text-green-700 rounded-full p-2">
              <CreditCard size={20} />
            </div>
            <div>
              <p className="font-medium text-ink">
                Plan actif : <span className="capitalize">{status.subscriptionPlan || "Abonnement"}</span>
              </p>
              {status.currentPeriodEnd && (
                <p className="text-ink-muted text-sm">
                  Renouvellement le{" "}
                  {new Date(status.currentPeriodEnd).toLocaleDateString("fr-FR")}
                </p>
              )}
            </div>
          </div>
          <Button
            text="Gérer l'abonnement"
            variant="secondary"
            icon={ExternalLink}
            onClick={handleManageBilling}
            disabled={portalLoading}
          />
        </div>
      )}

      {!isActive && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-[16px] p-6 flex flex-col shadow-lg ${
                plan.highlighted
                  ? "bg-primary text-white"
                  : "bg-surface text-ink"
              }`}
            >
              <div className="mb-4">
                <p className={`text-sm font-semibold uppercase tracking-wider mb-1 ${plan.highlighted ? "text-white/70" : "text-ink-muted"}`}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={`text-sm mb-1 ${plan.highlighted ? "text-white/70" : "text-ink-muted"}`}>
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="flex flex-col gap-2 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check size={16} className={plan.highlighted ? "text-white" : "text-success"} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                text={checkoutLoading === plan.priceId ? "Redirection..." : "S'abonner"}
                variant={plan.highlighted ? "secondary" : "primary"}
                onClick={() => handleSubscribe(plan.priceId)}
                disabled={checkoutLoading !== null}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
