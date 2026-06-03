import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Pencil, Plus, List, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import IngredientService from "../services/ingredientService";
import Button from "../components/ui/Button";

export default function IngredientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ingredient, setIngredient] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movementForm, setMovementForm] = useState({ quantity: "", reason: "" });
  const [savingMovement, setSavingMovement] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ingredientData, movementData] = await Promise.all([
        IngredientService.getById(id),
        IngredientService.getStockMovements(id),
      ]);
      setIngredient(ingredientData);
      setMovements(Array.isArray(movementData) ? movementData : []);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger les données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAddMovement = async (event) => {
    event.preventDefault();
    if (!movementForm.quantity || !movementForm.reason.trim()) {
      toast.error("Quantité et raison requises");
      return;
    }

    try {
      setSavingMovement(true);
      await IngredientService.addStockMovement({
        ingredientId: Number(id),
        quantity: Number(movementForm.quantity),
        reason: movementForm.reason.trim(),
      });
      toast.success("Mouvement de stock ajouté");
      setMovementForm({ quantity: "", reason: "" });
      setIsModalOpen(false);
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Impossible d'ajouter le mouvement");
    } finally {
      setSavingMovement(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-surface rounded w-1/3"></div>
        <div className="h-64 bg-surface rounded-[16px]"></div>
      </div>
    );
  }

  if (!ingredient) {
    return (
      <div className="text-ink-muted">Ingrédient introuvable.</div>
    );
  }

  const sortedMovements = [...movements].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-ink-muted mb-1">
            <button
              type="button"
              onClick={() => navigate("/stocks/ingredients")}
              className="text-ink-muted hover:text-ink"
            >
              <ChevronLeft size={18} strokeWidth={2} />
            </button>
            <span>Retour à la liste</span>
          </div>
          <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">{ingredient.name}</h1>
          <p className="text-[0.9375rem] text-ink-muted mt-1">
            Détails et historique des mouvements de stock.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            text="Modifier"
            variant="secondary"
            icon={Pencil}
            onClick={() => navigate(`/stocks/ingredients/${id}/edit`)}
          />
          <Button
            text="Ajouter un mouvement"
            variant="primary"
            icon={Plus}
            onClick={() => setIsModalOpen(true)}
          />
          <Button
            text="Voir l'historique complet"
            variant="ghost"
            icon={List}
            onClick={() => navigate(`/stocks/ingredients/${id}/movements`)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-surface-raised rounded-[16px] p-6 shadow-ambient">
          <h2 className="text-[1rem] font-semibold text-ink mb-3">Fiche ingrédient</h2>
          <div className="space-y-4 text-[0.9375rem] text-ink-secondary">
            <div>
              <p className="font-medium text-ink">Unité</p>
              <p>{ingredient.unit}</p>
            </div>
            <div>
              <p className="font-medium text-ink">Stock actuel</p>
              <p>{ingredient.stockQuantity}</p>
            </div>
            <div>
              <p className="font-medium text-ink">Seuil minimum</p>
              <p>{ingredient.minStockLevel}</p>
            </div>
            {ingredient.imageUrl && (
              <div>
                <p className="font-medium text-ink">Image</p>
                <img
                  src={ingredient.imageUrl}
                  alt={ingredient.name}
                  className="mt-2 w-full max-w-[240px] rounded-[12px] object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-surface-raised rounded-[16px] p-6 shadow-ambient">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-[1rem] font-semibold text-ink">Derniers mouvements</h2>
              <p className="text-[0.875rem] text-ink-muted mt-1">Historique des derniers changements de stock.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[0.9375rem]">
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
                {sortedMovements.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-5 py-12 text-center text-ink-muted text-[0.9375rem]">
                      Aucun mouvement enregistré.
                    </td>
                  </tr>
                ) : (
                  sortedMovements.slice(0, 5).map((movement) => (
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
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-[480px] bg-surface-raised rounded-[16px] shadow-elevated p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-[1.125rem] font-semibold text-ink">Ajouter un mouvement</h2>
                <p className="text-[0.9375rem] text-ink-muted mt-1">Ajustez le stock de l'ingrédient.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-ink-muted hover:text-ink p-1.5 rounded-[8px] hover:bg-surface transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <form onSubmit={handleAddMovement} className="space-y-4">
              <div>
                <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-2">Quantité</label>
                <input
                  type="number"
                  min="-99999"
                  step="0.01"
                  value={movementForm.quantity}
                  onChange={(e) => setMovementForm((prev) => ({ ...prev, quantity: e.target.value }))}
                  className="w-full border border-border rounded-[12px] px-4 py-3 text-ink text-[0.9375rem] bg-surface-raised focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="Ex. 10 ou -5"
                />
              </div>
              <div>
                <label className="block text-[0.8125rem] font-medium text-ink-secondary mb-2">Raison</label>
                <input
                  value={movementForm.reason}
                  onChange={(e) => setMovementForm((prev) => ({ ...prev, reason: e.target.value }))}
                  className="w-full border border-border rounded-[12px] px-4 py-3 text-ink text-[0.9375rem] bg-surface-raised focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="Réapprovisionnement, ajustement, etc."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-border mt-4">
                <Button
                  text="Annuler"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                />
                <Button text="Enregistrer" variant="primary" type="submit" disabled={savingMovement} />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
