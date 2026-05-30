import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function Forbidden() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-error flex items-center justify-center mx-auto mb-6">
          <ShieldAlert size={28} strokeWidth={2} />
        </div>

        <h1 className="text-[1.75rem] font-semibold text-ink tracking-tight">
          Accès refusé
        </h1>

        <p className="text-[0.9375rem] text-ink-secondary mt-3 leading-relaxed max-w-[400px] mx-auto">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>

        <div className="flex items-center justify-center gap-3 mt-8">
          <Link
            to="/"
            className="
              h-12
              px-6
              rounded-[10px]
              bg-primary
              text-white
              flex
              items-center
              gap-2
              font-medium
              text-[0.9375rem]
              hover:bg-primary-hover
              active:scale-[0.98]
              transition-all duration-200
              shadow-ambient hover:shadow-lifted
            "
          >
            <ArrowLeft size={18} strokeWidth={2} />
            Retour au Dashboard
          </Link>
        </div>

        <p className="text-center text-ink-muted text-[0.8125rem] mt-8">
          Code d'erreur : 403
        </p>
      </div>
    </div>
  );
}
