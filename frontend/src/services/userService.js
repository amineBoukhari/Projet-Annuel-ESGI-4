const backDomain = import.meta.env.VITE_BACKEND_DOMAIN;

const updatePassword = async (id, token, oldPassword, newPassword) => {
  try {
    const response = await fetch(`${backDomain}/api/auth/changePassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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

const updateUser = async (id, token, oldPassword, newPassword) => {
  try {
    const response = await fetch(`${backDomain}/api/auth/changePassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
    console.log("test: " + error);
  }
};

export default {
  updatePassword,
  updateUser
}