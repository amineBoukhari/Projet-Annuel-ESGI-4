import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router";
import Button from "../components/ui/Button";

export default function SubscriptionSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
      <CheckCircle size={56} className="text-success" />
      <h1 className="text-2xl font-semibold text-ink">Abonnement activé !</h1>
      <p className="text-ink-muted text-sm">Votre paiement a été accepté. Bienvenue sur la plateforme.</p>
      <Button text="Retour au tableau de bord" onClick={() => navigate("/")} />
    </div>
  );
}
