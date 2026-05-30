const backDomain = import.meta.env.VITE_BACKEND_DOMAIN;

const fetchExpenses = async () => {
  const response = await fetch(`${backDomain}/api/expenses/getAll`, {
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

const createExpense = async (data) => {
  const response = await fetch(`${backDomain}/api/expenses/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Erreur lors de la création de la dépense");
  }
  return result;
};

const deleteExpense = async (id) => {
  const response = await fetch(`${backDomain}/api/expenses/delete/${id}`, {
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

export default {
  fetchExpenses,
  createExpense,
  deleteExpense,
};
