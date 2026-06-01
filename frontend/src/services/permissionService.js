const backDomain = import.meta.env.VITE_BACKEND_DOMAIN;

const fetchAllPermissions = async () => {
  const response = await fetch(`${backDomain}/api/permissions/getAll`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Erreur lors du chargement des permissions");
  return data;
};

const fetchAllRoles = async () => {
  const response = await fetch(`${backDomain}/api/roles/getAll`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Erreur lors du chargement des rôles");
  return data;
};

const fetchRoleWithPermissions = async (roleId) => {
  const response = await fetch(`${backDomain}/api/roles/getWithPermissions/${roleId}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Erreur lors du chargement du rôle");
  return data;
};

const updateRolePermissions = async (roleId, permissionIds) => {
  const response = await fetch(`${backDomain}/api/roles/updatePermissions/${roleId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ permissionIds }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Erreur lors de la mise à jour");
  return data;
};

const createPermission = async (name) => {
  const response = await fetch(`${backDomain}/api/permissions/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Erreur lors de la création");
  return data;
};

const deletePermission = async (id) => {
  const response = await fetch(`${backDomain}/api/permissions/delete/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Erreur lors de la suppression");
  return data;
};

export default {
  fetchAllPermissions,
  fetchAllRoles,
  fetchRoleWithPermissions,
  updateRolePermissions,
  createPermission,
  deletePermission,
};
