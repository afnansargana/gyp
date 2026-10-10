const jwt = require("jsonwebtoken");
const { secretKey } = require("../config");
const { attachAuthContext } = require("./rbac.middleware");

/**
 * Verify Bearer JWT and attach req.user / req.auth.
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

    attachAuthContext(req, decoded);
    next();
  });
};

module.exports = authenticateToken;
