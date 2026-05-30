const backDomain = import.meta.env.VITE_BACKEND_DOMAIN;

const getAll = async () => {
  const response = await fetch(`${backDomain}/api/suppliers/getAll`, {
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

const SupplierService = {
  getAll,
};

export default SupplierService;
