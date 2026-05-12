export const decodeTokenPayload = (token) => {
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload;
  } catch (error) {
    console.error("Erreur lors du décodage du token:", error);
    return null; // On retourne null au lieu de faire crasher l'app
  }
};
