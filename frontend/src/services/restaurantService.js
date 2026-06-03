const backDomain = import.meta.env.VITE_BACKEND_DOMAIN;

const fetchAllRestaurants = async () => {
  const response = await fetch(`${backDomain}/api/restaurants/getAll`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Erreur lors du chargement des restaurants");
  return data;
};

const fetchRestaurantById = async (id) => {
  const response = await fetch(`${backDomain}/api/restaurants/get/${id}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Restaurant introuvable");
  return data;
};

const createRestaurant = async (payload) => {
  const response = await fetch(`${backDomain}/api/restaurants/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || data.error || "Erreur lors de la création");
  return data;
};

const updateRestaurant = async (id, payload) => {
  const response = await fetch(`${backDomain}/api/restaurants/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Erreur lors de la mise à jour");
  return data;
};

const deleteRestaurant = async (id) => {
  const response = await fetch(`${backDomain}/api/restaurants/delete/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Erreur lors de la suppression");
  return data;
};

export default {
  fetchAllRestaurants,
  fetchRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
