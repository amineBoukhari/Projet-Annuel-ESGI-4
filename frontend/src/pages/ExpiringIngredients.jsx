import { useEffect, useState } from "react";
import { AlertTriangle, Trash2, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import ingredientService from "../services/ingredientService";
import Button from "../components/ui/Button";

export default function ExpiringIngredients() {
  const navigate = useNavigate();
  const [expiringIngredients, setExpiringIngredients] = useState([]);
  const [expiredIngredients, setExpiredIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("expiring"); // expiring or expired

  useEffect(() => {
    const loadIngredients = async () => {
      try {
        setLoading(true);
        const [expiring, expired] = await Promise.all([
          ingredientService.getExpiringIngredients(),
          ingredientService.getExpiredIngredients(),
        ]);
        setExpiringIngredients(expiring || []);
        setExpiredIngredients(expired || []);
      } catch (error) {
        console.error("Error loading ingredients:", error);
        toast.error("Erreur lors du chargement des ingrédients");
      } finally {
        setLoading(false);
      }
    };
    loadIngredients();
  }, []);

  const handleDelete = async (ingredientId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet ingrédient ?")) {
      return;
    }
    try {
      await ingredientService.delete(ingredientId);
      toast.success("Ingrédient supprimé");
      setExpiringIngredients(expiringIngredients.filter(i => i.id !== ingredientId));
      setExpiredIngredients(expiredIngredients.filter(i => i.id !== ingredientId));
    } catch (error) {
      console.error("Error deleting ingredient:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const daysUntilExpiration = (expirationDate) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const currentList = activeTab === "expiring" ? expiringIngredients : expiredIngredients;

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-surface rounded w-1/3"></div>
        <div className="h-64 bg-surface rounded-[16px]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/stocks/ingredients")}
          className="inline-flex items-center gap-2 text-ink-muted hover:text-ink"
        >
          <ChevronLeft size={18} strokeWidth={2} />
          Retour aux ingrédients
        </button>
      </div>

      <div className="bg-surface-raised rounded-[16px] p-6 shadow-ambient">
        <div className="mb-6">
          <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">
            Alertes de péremption
          </h1>
          <p className="text-[0.9375rem] text-ink-muted mt-1">
            Gérez les ingrédients proches de la péremption et les produits expirés
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab("expiring")}
            className={`px-4 py-2 font-medium text-[0.9375rem] border-b-2 transition-colors ${
              activeTab === "expiring"
                ? "border-warning text-warning"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            À expirer bientôt ({expiringIngredients.length})
          </button>
          <button
            onClick={() => setActiveTab("expired")}
            className={`px-4 py-2 font-medium text-[0.9375rem] border-b-2 transition-colors ${
              activeTab === "expired"
                ? "border-error text-error"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            Expirés ({expiredIngredients.length})
          </button>
        </div>

        {/* Content */}
        {currentList.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-ink-muted mx-auto mb-4 opacity-50" />
            <p className="text-ink-muted font-medium">
              {activeTab === "expiring"
                ? "Aucun ingrédient à expirer bientôt"
                : "Aucun ingrédient expiré"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="text-left text-[0.8125rem] font-semibold text-ink-secondary px-4 py-3">
                    Nom
                  </th>
                  <th className="text-left text-[0.8125rem] font-semibold text-ink-secondary px-4 py-3">
                    Quantité
                  </th>
                  <th className="text-left text-[0.8125rem] font-semibold text-ink-secondary px-4 py-3">
                    Date de péremption
                  </th>
                  <th className="text-left text-[0.8125rem] font-semibold text-ink-secondary px-4 py-3">
                    {activeTab === "expiring" ? "Jours restants" : "Jours expirés"}
                  </th>
                  <th className="text-left text-[0.8125rem] font-semibold text-ink-secondary px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentList.map((ingredient) => {
                  const days = daysUntilExpiration(ingredient.expirationDate);
                  const statusColor = activeTab === "expiring" 
                    ? days <= 3 ? "error" : "warning"
                    : "error";
                  
                  return (
                    <tr key={ingredient.id} className="hover:bg-surface transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-medium text-ink">{ingredient.name}</span>
                      </td>
                      <td className="px-4 py-3 text-ink-secondary">
                        {ingredient.stockQuantity} {ingredient.unit}
                      </td>
                      <td className="px-4 py-3 text-ink-secondary">
                        {formatDate(ingredient.expirationDate)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[0.8125rem] font-medium ${
                          statusColor === "error" ? "text-error" : "text-warning"
                        }`}>
                          {Math.abs(days)} {days > 0 ? "jour(s)" : "jour(s)"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/stocks/ingredients/${ingredient.id}`)}
                            className="px-3 py-1.5 text-[0.8125rem] font-medium text-primary hover:bg-primary/10 rounded-sm transition-colors"
                          >
                            Voir
                          </button>
                          <button
                            onClick={() => handleDelete(ingredient.id)}
                            className="p-1.5 text-error hover:bg-red-50 rounded-sm transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
