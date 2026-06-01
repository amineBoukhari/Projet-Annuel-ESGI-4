const backDomain = import.meta.env.VITE_BACKEND_DOMAIN;

const getAllUsers = async () => {
  try {
    const response = await fetch(`${backDomain}/api/users/getAll`, {
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    return { status: "error", error: error.message };
  }
};

const getUserById = async (id) => {
  try {
    const response = await fetch(`${backDomain}/api/users/get/${id}`, {
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    return { status: "error", error: error.message };
  }
};

const createUser = async ({ username, email, password, role }) => {
  try {
    let route = "/createEmployee";
    if (role === "Owner") route = "/createOwner";
    else if (role === "Manager") route = "/createManager";

    const response = await fetch(`${backDomain}/api/users${route}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    return await response.json();
  } catch (error) {
    return { status: "error", error: error.message };
  }
};

const updateUser = async (id, { username, email }) => {
  try {
    const response = await fetch(`${backDomain}/api/users/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username,
        email,
      }),
    });

    return await response.json();
  } catch (error) {
    return { status: "error", error: error.message };
  }
};

const updateUserRole = async (id, newRole) => {
  try {
    const response = await fetch(`${backDomain}/api/users/updateRole/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        newRole,
      }),
    });

    return await response.json();
  } catch (error) {
    return { status: "error", error: error.message };
  }
};

const deleteUser = async (id) => {
  try {
    const response = await fetch(`${backDomain}/api/users/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    return await response.json();
  } catch (error) {
    return { status: "error", error: error.message };
  }
};

const updatePassword = async (id, oldPassword, newPassword) => {
  try {
    const response = await fetch(`${backDomain}/api/auth/changePassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        id: id,
        oldPassword: oldPassword,
        newPassword: newPassword,
      }),
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
    return { status: "error", message: error.message };
  }
};

const updateProfile = async (id, newEmail, newUsername) => {
  try {
    const response = await fetch(`${backDomain}/api/users/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        id: id,
        email: newEmail,
        username: newUsername,
      }),
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

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserRole,
  deleteUser,
  updatePassword,
  updateProfile,
};
