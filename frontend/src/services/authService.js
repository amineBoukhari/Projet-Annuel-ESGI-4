const backDomain = import.meta.env.VITE_BACKEND_DOMAIN;

export const authService = {
  fetchUser: async () => {
    try {
      const response = await fetch(`${backDomain}/api/users/getMe`, {
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.log("Erreur dans fetchUser service:", error.message);
      throw error;
    }
  },

  login: async (inputLogin, inputPassword) => {
    try {
      const response = await fetch(`${backDomain}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: inputLogin,
          password: inputPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Une erreur est survenue pendant le login');
      }

      return await response.json();
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await fetch(`${backDomain}/api/auth/logout`, {
        method: "POST", // Assure-toi que c'est du POST comme sur ton Back
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
