const backDomain = import.meta.env.VITE_BACKEND_DOMAIN;

const fetchStats = async () => {
  const response = await fetch(`${backDomain}/api/dashboard/stats`, {
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

const fetchRecentActivity = async () => {
  const response = await fetch(`${backDomain}/api/dashboard/recent-activity`, {
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

const fetchRevenue = async (period) => {
  const response = await fetch(`${backDomain}/api/dashboard/revenue?period=${period}`, {
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

export default {
  fetchStats,
  fetchRecentActivity,
  fetchRevenue,
};
