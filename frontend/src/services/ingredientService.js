const backDomain = import.meta.env.VITE_BACKEND_DOMAIN;

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = new Error(response.statusText || `HTTP Error: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.status === 204 ? null : response.json();
};

const getAll = async () => {
  const response = await fetch(`${backDomain}/api/ingredients/getAll`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return handleResponse(response);
};

const getById = async (id) => {
  const response = await fetch(`${backDomain}/api/ingredients/get/${id}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return handleResponse(response);
};

const create = async (payload) => {
  const response = await fetch(`${backDomain}/api/ingredients/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

const update = async (id, payload) => {
  const response = await fetch(`${backDomain}/api/ingredients/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

const remove = async (id) => {
  const response = await fetch(`${backDomain}/api/ingredients/delete/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return handleResponse(response);
};

const getLowStock = async () => {
  const response = await fetch(`${backDomain}/api/ingredients/lowStock`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return handleResponse(response);
};

const addStockMovement = async ({ ingredientId, quantity, reason }) => {
  const response = await fetch(`${backDomain}/api/ingredients/stockMovement`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ ingredientId, quantity, reason }),
  });
  return handleResponse(response);
};

const getStockMovements = async (ingredientId) => {
  const response = await fetch(`${backDomain}/api/ingredients/${ingredientId}/stockMovements`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return handleResponse(response);
};

const IngredientService = {
  getAll,
  getById,
  create,
  update,
  remove,
  getLowStock,
  addStockMovement,
  getStockMovements,
};

export default IngredientService;
