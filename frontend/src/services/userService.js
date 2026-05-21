const backDomain = import.meta.env.VITE_BACKEND_DOMAIN;

const updatePassword = async (id, oldPassword, newPassword) => {
  try {
    const response = await fetch(`${backDomain}/api/auth/changePassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({
        id: id,
        oldPassword: oldPassword,
        newPassword: newPassword,
      }),
    });
  
    if (!response.ok) {
      return {status: 'error', message: 'Une erreur est survenue lors de la mise à jour du mot de passe'}
    }
  
    return await response.json();
  } catch (error) {
    console.log('test: ' + error)
  }
};

const updateProfile = async (id, newEmail, newUsername) => {
  try {
    const response = await fetch(`${backDomain}/api/users/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({
        id: id,
        email: newEmail,
        username: newUsername,
      }),
    });

    if (!response.ok) {
      return {
        status: "error",
        message:
          "Une erreur est survenue lors de la mise à jour du profil",
      };
    }

    return await response.json();
  } catch (error) {
    return { 'status': 'error', message: error.message}
  }
};

export default {
  updatePassword,
  updateProfile,
};