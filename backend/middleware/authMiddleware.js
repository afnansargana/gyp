const jwt = require("jsonwebtoken");
const { secretKey } = require("../config");

/**
 * Verifies Bearer JWT and attaches a normalized `req.user` payload.
 * Expected claims: userId, isAdmin, isMechanic
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const userId = decoded.userId || decoded._id;
    if (!userId) {
      return res.status(403).json({ message: "Invalid token payload" });
    }

    const id = String(userId);
    req.user = {
      userId: id,
      _id: id, // back-compat for older controllers
      isAdmin: !!decoded.isAdmin,
      isMechanic: !!decoded.isMechanic,
      role: decoded.isAdmin
        ? "admin"
        : decoded.isMechanic
          ? "mechanic"
          : "customer",
    };
    req.token = token;
    next();
  });
};

module.exports = authenticateToken;
