import { useEffect, useState } from "react";
import { Plus, RefreshCw, UtensilsCrossed } from "lucide-react";
import toast from "react-hot-toast";
import restaurantService from "../services/restaurantService";
import RestaurantsTable from "../features/restaurants/components/RestaurantsTable";
import RestaurantDetailPanel from "../features/restaurants/components/RestaurantDetailPanel";
import CreateRestaurantModal from "../features/restaurants/components/CreateRestaurantModal";
import EditRestaurantModal from "../features/restaurants/components/EditRestaurantModal";
import Button from "../components/ui/Button";
import { useAuth } from "../features/auth/hooks/useAuth";

export default function Restaurants() {
  const { user } = useAuth();
  const isAdmin = user?.role?.name === "Admin";

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await restaurantService.fetchAllRestaurants();
      setRestaurants(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Impossible de charger les restaurants");
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce restaurant ? Tous ses membres seront également supprimés.")) return;
    try {
      await restaurantService.deleteRestaurant(id);
      toast.success("Restaurant supprimé");
      if (selectedRestaurant?.id === id) setSelectedRestaurant(null);
      await load();
    } catch (err) {
      toast.error(err.message || "Erreur lors de la suppression");
    }
  };

  const handleView = (restaurant) => {
    setSelectedRestaurant((prev) => (prev?.id === restaurant.id ? null : restaurant));
  };

  const handleCreated = async () => {
    await load();
    setIsCreateOpen(false);
    toast.success("Restaurant et compte owner créés");
  };

  const handleSaved = async () => {
    await load();
    setEditingRestaurant(null);
    setSelectedRestaurant(null);
  };

  const totalMembers = restaurants.reduce((acc, r) => acc + (r.users?.length || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">Restaurants</h1>
          <p className="text-[0.9375rem] text-ink-muted mt-1">
            {isAdmin ? "Gérez tous les restaurants de la plateforme." : "Informations de votre restaurant."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button text="Actualiser" variant="ghost" icon={RefreshCw} onClick={load} />
          {isAdmin && (
            <Button
              text="Ajouter"
              variant="primary"
              icon={Plus}
              onClick={() => setIsCreateOpen(true)}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center">
              <UtensilsCrossed size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">Restaurants</span>
          </div>
          <p className="text-[1.5rem] font-semibold text-ink">{restaurants.length}</p>
        </div>
        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center">
              <UtensilsCrossed size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">Total membres</span>
          </div>
          <p className="text-[1.5rem] font-semibold text-ink">{totalMembers}</p>
        </div>
        <div className="bg-surface-raised rounded-[16px] p-5 shadow-ambient">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[8px] bg-surface text-ink-muted flex items-center justify-center">
              <UtensilsCrossed size={18} strokeWidth={2} />
            </div>
            <span className="text-[0.8125rem] font-medium text-ink-secondary">Moy. membres</span>
          </div>
          <p className="text-[1.5rem] font-semibold text-ink">
            {restaurants.length > 0 ? Math.round(totalMembers / restaurants.length) : 0}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-ink-muted text-[0.9375rem]">
          Chargement...
        </div>
      ) : (
        <div className="space-y-4">
          <RestaurantsTable
            restaurants={restaurants}
            onEdit={(r) => { setEditingRestaurant(r); setSelectedRestaurant(null); }}
            onDelete={handleDelete}
            onView={handleView}
            isAdmin={isAdmin}
          />
          {selectedRestaurant && (
            <RestaurantDetailPanel
              restaurant={selectedRestaurant}
              onClose={() => setSelectedRestaurant(null)}
              isAdmin={isAdmin}
            />
          )}
        </div>
      )}

      <CreateRestaurantModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={handleCreated}
      />

      <EditRestaurantModal
        restaurant={editingRestaurant}
        onClose={() => setEditingRestaurant(null)}
        onSaved={handleSaved}
      />
    </div>
  );
}
