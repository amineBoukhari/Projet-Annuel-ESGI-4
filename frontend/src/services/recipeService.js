const backDomain = import.meta.env.VITE_BACKEND_DOMAIN;

const handleResponse = async (response) => {
  const result = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(result?.error || response.statusText || `HTTP Error: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return result;
};

const getAll = async () => {
  const response = await fetch(`${backDomain}/api/recipes/getAll`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return handleResponse(response);
};

const getById = async (id) => {
  const response = await fetch(`${backDomain}/api/recipes/get/${id}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return handleResponse(response);
};

const create = async (payload) => {
  const response = await fetch(`${backDomain}/api/recipes/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

const update = async (id, payload) => {
  const response = await fetch(`${backDomain}/api/recipes/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

const remove = async (id) => {
  const response = await fetch(`${backDomain}/api/recipes/delete/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return handleResponse(response);
};

const cook = async (id, portions) => {
  const response = await fetch(`${backDomain}/api/recipes/cook/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ portions }),
  });
  return handleResponse(response);
};

const RecipeService = {
  getAll,
  getById,
  create,
  update,
  remove,
  cook,
};

export default RecipeService;
