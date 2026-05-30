import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
            4
          </div>
          <div className="w-14 h-14 rounded-full border-2 border-primary text-primary flex items-center justify-center text-2xl font-bold">
            0
          </div>
          <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
            4
          </div>
        </div>

        <h1 className="text-[1.75rem] font-semibold text-ink tracking-tight">
          Page introuvable
        </h1>

        <p className="text-[0.9375rem] text-ink-secondary mt-3 leading-relaxed max-w-[400px] mx-auto">
          La page que vous recherchez n'existe pas ou a peut-être été déplacée.
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
          Code d'erreur : 404
        </p>
      </div>
    </div>
  );
}
