export const auth = {
  fetchUser: async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/getMe`, {
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
      // ✅ TRÈS IMPORTANT : On propage l'erreur pour que le try/catch de ton AuthContext l'attrape !
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/auth/logout`, {
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
