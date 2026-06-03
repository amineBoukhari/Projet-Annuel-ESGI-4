import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import IngredientService from "../services/ingredientService";

export default function IngredientMovements() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ingredient, setIngredient] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [ingredientData, movementData] = await Promise.all([
          IngredientService.getById(id),
          IngredientService.getStockMovements(id),
        ]);
        setIngredient(ingredientData);
        setMovements(Array.isArray(movementData) ? movementData : []);
      } catch (error) {
        console.error(error);
        toast.error("Impossible de charger l'historique");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate(`/stocks/ingredients/${id}`)}
            className="inline-flex items-center gap-2 text-ink-muted hover:text-ink mb-2"
          >
            <ChevronLeft size={18} strokeWidth={2} />
            Retour
          </button>
          <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">
            Historique des mouvements
          </h1>
          <p className="text-[0.9375rem] text-ink-muted mt-1">
            {ingredient ? `Mouvements pour ${ingredient.name}` : "Chargement des mouvements..."}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-ink-muted text-[0.9375rem]">
          Chargement...
        </div>
      ) : (
        <div className="overflow-hidden rounded-[16px] border border-border bg-surface-raised shadow-ambient">
          <div className="overflow-x-auto">
            <table className="min-w-full text-[0.9375rem]">
              <thead className="bg-surface">
                <tr>
                  {['Date', 'Quantité', 'Raison'].map((header) => (
                    <th
                      key={header}
                      className="px-5 py-3.5 text-left text-[0.75rem] font-semibold text-ink-secondary uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {movements.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-5 py-12 text-center text-ink-muted text-[0.9375rem]">
                      Aucun mouvement de stock trouvé.
                    </td>
                  </tr>
                ) : (
                  movements
                    .slice()
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((movement) => (
                      <tr key={movement.id} className="hover:bg-surface transition-colors duration-150">
                        <td className="px-5 py-4 text-ink-secondary">{new Date(movement.createdAt).toLocaleString('fr-FR')}</td>
                        <td className="px-5 py-4 text-ink">{movement.quantity}</td>
                        <td className="px-5 py-4 text-ink-secondary">{movement.reason}</td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
