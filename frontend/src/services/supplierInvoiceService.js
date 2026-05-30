const backDomain = import.meta.env.VITE_BACKEND_DOMAIN;

const create = async (data) => {
  const response = await fetch(`${backDomain}/api/supplierInvoices/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Erreur lors de la création de la facture");
  }
  return result;
};

const getAll = async (restaurantId) => {
  const url = restaurantId
    ? `${backDomain}/api/supplierInvoices/getAll?restaurantId=${restaurantId}`
    : `${backDomain}/api/supplierInvoices/getAll`;
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
  const response = await fetch(`${backDomain}/api/supplierInvoices/get/${id}`, {
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
  const response = await fetch(`${backDomain}/api/supplierInvoices/update/${id}`, {
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

const remove = async (id) => {
  const response = await fetch(`${backDomain}/api/supplierInvoices/delete/${id}`, {
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

const SupplierInvoiceService = {
  create,
  getAll,
  getById,
  update,
  remove,
};

export default SupplierInvoiceService;
