const backDomain = import.meta.env.VITE_BACKEND_DOMAIN;

const getAll = async (restaurantId) => {
  const url = restaurantId
    ? `${backDomain}/api/purchaseOrders/getAll?restaurantId=${restaurantId}`
    : `${backDomain}/api/purchaseOrders/getAll`;
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) {
    const err = new Error(`HTTP Error: ${response.status}`);
    err.status = response.status;
    throw err;
  }
  return await response.json();
};

const getById = async (id) => {
  const response = await fetch(`${backDomain}/api/purchaseOrders/get/${id}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) {
    const err = new Error(`HTTP Error: ${response.status}`);
    err.status = response.status;
    throw err;
  }
  return await response.json();
};

const updateStatus = async (id, status) => {
  const response = await fetch(`${backDomain}/api/purchaseOrders/updateStatus/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Erreur lors de la mise à jour du statut");
  }
  return result;
};

const create = async (data) => {
  const response = await fetch(`${backDomain}/api/purchaseOrders/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Erreur lors de la création de la commande");
  }
  return result;
};

const PurchaseOrderService = {
  getAll,
  getById,
  updateStatus,
  create,
};

export default PurchaseOrderService;
