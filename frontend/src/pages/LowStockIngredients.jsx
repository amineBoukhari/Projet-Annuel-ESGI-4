import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AlertTriangle, Eye, Box } from "lucide-react";
import toast from "react-hot-toast";
import IngredientService from "../services/ingredientService";
import Button from "../components/ui/Button";

export default function LowStockIngredients() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const data = await IngredientService.getLowStock();
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        toast.error("Impossible de charger les alertes de stock");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">Alertes bas stock</h1>
          <p className="text-[0.9375rem] text-ink-muted mt-1">
            Liste des ingrédients dont le niveau est inférieur au seuil minimum.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            text="Voir tous les ingrédients"
            variant="ghost"
            icon={Box}
            onClick={() => navigate("/stocks/ingredients")}
          />
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
                  {['Nom', 'Stock', 'Seuil', 'Écart', ''].map((header) => (
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
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-ink-muted text-[0.9375rem]">
                      Aucun ingrédient en dessous du seuil.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-surface transition-colors duration-150">
                      <td className="px-5 py-4 font-medium text-ink">{item.name}</td>
                      <td className="px-5 py-4 text-ink">{item.stockQuantity}</td>
                      <td className="px-5 py-4 text-ink-secondary">{item.minStockLevel}</td>
                      <td className="px-5 py-4 text-error">{item.stockQuantity - item.minStockLevel}</td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/stocks/ingredients/${item.id}`)}
                          className="text-ink-muted hover:text-ink p-2 rounded-[8px] hover:bg-surface transition-all duration-150"
                          title="Voir détail"
                        >
                          <Eye size={16} strokeWidth={2} />
                        </button>
                      </td>
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
