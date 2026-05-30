const backDomain = import.meta.env.VITE_BACKEND_DOMAIN;

const fetchInvoices = async () => {
  const response = await fetch(`${backDomain}/api/invoices/getAll`, {
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

const fetchInvoiceById = async (id) => {
  const response = await fetch(`${backDomain}/api/invoices/get/${id}`, {
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

const fetchUnpaidInvoices = async () => {
  const response = await fetch(`${backDomain}/api/invoices/getUnpaid`, {
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

const createInvoice = async (data) => {
  const response = await fetch(`${backDomain}/api/invoices/create`, {
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

const updateInvoice = async (id, data) => {
  const response = await fetch(`${backDomain}/api/invoices/update/${id}`, {
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

const validateInvoice = async (id) => {
  const response = await fetch(`${backDomain}/api/invoices/validate/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Erreur lors de la validation");
  }
  return result;
};

const cancelInvoice = async (id) => {
  const response = await fetch(`${backDomain}/api/invoices/cancel/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Erreur lors de l'annulation");
  }
  return result;
};

const payInvoice = async (id, method) => {
  const response = await fetch(`${backDomain}/api/invoices/pay/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ method }),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Erreur lors du paiement");
  }
  return result;
};

const quickCreateInvoice = async (data) => {
  const response = await fetch(`${backDomain}/api/invoices/quickCreate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Erreur lors de l'encaissement rapide");
  }
  return result;
};

export default {
  fetchInvoices,
  fetchInvoiceById,
  fetchUnpaidInvoices,
  createInvoice,
  updateInvoice,
  validateInvoice,
  cancelInvoice,
  payInvoice,
  quickCreateInvoice,
};
