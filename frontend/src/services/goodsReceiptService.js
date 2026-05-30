const backDomain = import.meta.env.VITE_BACKEND_DOMAIN;

const create = async (data) => {
  const response = await fetch(`${backDomain}/api/goodsReceipts/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Erreur lors de la création de la réception");
  }
  return result;
};

const getAll = async (restaurantId) => {
  const url = restaurantId
    ? `${backDomain}/api/goodsReceipts/getAll?restaurantId=${restaurantId}`
    : `${backDomain}/api/goodsReceipts/getAll`;
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
  const response = await fetch(`${backDomain}/api/goodsReceipts/get/${id}`, {
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

const update = async (id, data) => {
  const response = await fetch(`${backDomain}/api/goodsReceipts/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Erreur lors de la mise à jour");
  }
  return result;
};

const validate = async (id) => {
  const response = await fetch(`${backDomain}/api/goodsReceipts/validate/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({}),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Erreur lors de la validation");
  }
  return result;
};

const remove = async (id) => {
  const response = await fetch(`${backDomain}/api/goodsReceipts/delete/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Erreur lors de la suppression");
  }
  return result;
};

const GoodsReceiptService = {
  create,
  getAll,
  getById,
  update,
  validate,
  remove,
};

export default GoodsReceiptService;
