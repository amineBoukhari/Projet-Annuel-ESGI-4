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

const addWaste = async (payload) => {
  const response = await fetch(`${backDomain}/api/waste/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

const WasteService = {
  addWaste,
};

export default WasteService;
