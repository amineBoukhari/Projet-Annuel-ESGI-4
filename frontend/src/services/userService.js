const backDomain = import.meta.env.VITE_BACKEND_DOMAIN;

const updatePassword = async (id, oldPassword, newPassword) => {
  try {
    const response = await fetch(`${backDomain}/api/auth/changePassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id, oldPassword, newPassword }),
    });
    if (!response.ok) {
      return {
        status: "error",
        message:
          "Une erreur est survenue lors de la mise à jour du mot de passe",
      };
    }
    return await response.json();
  } catch (error) {
    console.log("test: " + error);
  }
};

const updateProfile = async (id, newEmail, newUsername) => {
  try {
    const response = await fetch(`${backDomain}/api/users/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id, email: newEmail, username: newUsername }),
    });
    if (!response.ok) {
      return {
        status: "error",
        message: "Une erreur est survenue lors de la mise à jour du profil",
      };
    }
    return await response.json();
  } catch (error) {
    return { status: "error", message: error.message };
  }
};

const fetchUsers = async () => {
  const response = await fetch(`${backDomain}/api/users/getAll`, {
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

const createUser = async (userData) => {
  const response = await fetch(`${backDomain}/api/users/${userData.endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      mustChangePassword: userData.mustChangePassword,
      restaurantId: userData.restaurantId,
    }),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(
      data.error || "Erreur lors de la création de l'utilisateur"
    );
  return data;
};

const deleteUser = async (id) => {
  const response = await fetch(`${backDomain}/api/users/delete/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.error || "Erreur lors de la suppression");
  return data;
};

const updateUserRole = async (id, newRole) => {
  const response = await fetch(`${backDomain}/api/users/updateRole/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ newRole }),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.error || "Erreur lors de la mise à jour du rôle");
  return data;
};

const assignRestaurant = async (userId, restaurantId) => {
  const response = await fetch(
    `${backDomain}/api/users/assignRestaurant/${userId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ restaurantId }),
    }
  );
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.error || "Erreur lors de l'affectation");
  return data;
};

const removeFromRestaurant = async (userId) => {
  const response = await fetch(
    `${backDomain}/api/users/assignRestaurant/${userId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ restaurantId: null }),
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Erreur lors du retrait");
  return data;
};

export default {
  updatePassword,
  updateProfile,
  fetchUsers,
  createUser,
  deleteUser,
  updateUserRole,
  assignRestaurant,
  removeFromRestaurant,
};
