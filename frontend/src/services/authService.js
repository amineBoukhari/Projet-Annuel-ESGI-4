const backDomain = import.meta.env.VITE_BACKEND_DOMAIN;

export const authService = {
  fetchUser: async () => {
    const response = await fetch(`${backDomain}/api/users/getMe`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const err = new Error(`HTTP Error: ${response.status}`);
      err.status = response.status;
      throw err;
    }

    return await response.json();
  },

  login: async (inputLogin, inputPassword) => {
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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Une erreur est survenue pendant le login");
    }

    return data;
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
