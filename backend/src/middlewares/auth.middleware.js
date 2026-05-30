const jwt = require("jsonwebtoken");
console.log("Auth middleware loaded");

async function checkAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Access denied. Token not found" });
  }

  try {
    console.log("JWT_SECRET défini ?", !!process.env.JWT_SECRET);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    req.token = token;
    next();
  } catch (error) {
    console.error("Auth error:", error.name, error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ error: "Token expired" });
    }
    return res.status(403).json({ error: error.message });
  }
}

module.exports = checkAuth;
