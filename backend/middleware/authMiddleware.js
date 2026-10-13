const jwt = require("jsonwebtoken");
const { secretKey } = require("../config");

function extractToken(req) {
  const cookieToken = req.cookies?.accessToken;
  if (cookieToken) return cookieToken;

  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return null;
}

const authenticateToken = (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const userId = decoded.userId || decoded._id;
    if (!userId) {
      return res.status(403).json({ message: "Invalid token payload" });
    }

    const id = String(userId);
    req.user = {
      userId: id,
      _id: id,
      isAdmin: !!decoded.isAdmin,
      isMechanic: !!decoded.isMechanic,
      role:
        decoded.role ||
        (decoded.isAdmin ? "admin" : decoded.isMechanic ? "mechanic" : "customer"),
    };
    req.token = token;
    next();
  });
};

module.exports = authenticateToken;
