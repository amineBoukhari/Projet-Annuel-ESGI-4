const backDomain = import.meta.env.VITE_BACKEND_DOMAIN;

const fetchSubscriptionStatus = async () => {
  const response = await fetch(`${backDomain}/api/subscription/status`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!response.ok) {
    const err = new Error(`HTTP Error: ${response.status}`);
    err.status = response.status;
    throw err;
  }
  return await response.json();
};

const createCheckoutSession = async (planId) => {
  const response = await fetch(`${backDomain}/api/subscription/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ planId }),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Erreur lors de la création de la session de paiement');
  }
  return result;
};

const createPortalSession = async () => {
  const response = await fetch(`${backDomain}/api/subscription/portal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Erreur lors de la création du portail de facturation');
  }
  return result;
};

export default { fetchSubscriptionStatus, createCheckoutSession, createPortalSession };
