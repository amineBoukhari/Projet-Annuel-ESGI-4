import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Package, AlertTriangle, TrendingUp, Box, List, PlusCircle, Clock } from "lucide-react";
import IngredientService from "../services/ingredientService";
import Button from "../components/ui/Button";

export default function Stocks() {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [allIngredients, lowStockIngredients] = await Promise.all([
        IngredientService.getAll(),
        IngredientService.getLowStock(),
      ]);
      setIngredients(Array.isArray(allIngredients) ? allIngredients : []);
      setLowStock(Array.isArray(lowStockIngredients) ? lowStockIngredients : []);
    } catch (error) {
      console.error(error);
      setIngredients([]);
      setLowStock([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const totalStockQuantity = ingredients.reduce(
    (sum, ingredient) => sum + Number(ingredient.stockQuantity || 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">Stocks</h1>
          <p className="text-[0.9375rem] text-ink-muted mt-1">
            Suivez les ingrédients, les alertes de stock et les mouvements.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            text="Ingrédients"
            variant="secondary"
            icon={List}
            onClick={() => navigate("/stocks/ingredients")}
          />
          <Button
            text="Bas stock"
            variant="ghost"
            icon={AlertTriangle}
            onClick={() => navigate("/stocks/low-stock")}
          />
          <Button
            text="Péremption"
            variant="ghost"
            icon={Clock}
            onClick={() => navigate("/stocks/expiring-ingredients")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center">
              <Package size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">Articles en stock</span>
          </div>
          <p className="text-[1.5rem] font-semibold text-ink">{ingredients.length}</p>
        </div>
        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center">
              <AlertTriangle size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">Alertes</span>
          </div>
          <p className="text-[1.5rem] font-semibold text-ink">{lowStock.length}</p>
        </div>
        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center">
              <TrendingUp size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">Quantité totale</span>
          </div>
          <p className="text-[1.5rem] font-semibold text-ink">{totalStockQuantity}</p>
        </div>
        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center">
              <Box size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">Suivi</span>
          </div>
          <p className="text-[1.5rem] font-semibold text-ink-muted">Mouvements & niveaux</p>
        </div>
      </div>

      <div className="bg-surface-raised rounded-[16px] p-8 shadow-ambient">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-[1.125rem] font-medium text-ink">Gestion des stocks</h2>
            <p className="text-[0.9375rem] text-ink-secondary mt-1">
              Accédez à la liste des ingrédients et aux alertes de faible stock.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              text="Voir ingrédients"
              variant="secondary"
              icon={List}
              onClick={() => navigate("/stocks/ingredients")}
            />
            <Button
              text="Ajouter un ingrédient"
              variant="primary"
              icon={PlusCircle}
              onClick={() => navigate("/stocks/ingredients/new")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
