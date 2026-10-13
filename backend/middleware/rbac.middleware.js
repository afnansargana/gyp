const User = require("../models/User");

/**
 * Resolve live roles from MongoDB (not only JWT claims) to prevent stale tokens
 * after an admin demotes a user.
 */
async function loadUserRoles(req) {
  if (req.dbUser) return req.dbUser;

  const user = await User.findById(req.user.userId).select(
    "isAdmin isMechanic isVerified username email"
  );

  if (!user) {
    const error = new Error("User not found");
    error.status = 401;
    throw error;
  }

  req.dbUser = user;
  req.user.isAdmin = !!user.isAdmin;
  req.user.isMechanic = !!user.isMechanic;
  req.user.role = user.isAdmin
    ? "admin"
    : user.isMechanic
      ? "mechanic"
      : "customer";

  return user;
}

/**
 * Factory: require one of the allowed roles after authenticateToken.
 * @param  {...('admin'|'mechanic'|'customer')} roles
 */
function requireRoles(...roles) {
  const allowed = new Set(roles);

  return async (req, res, next) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      await loadUserRoles(req);

      if (!allowed.has(req.user.role)) {
        return res.status(403).json({
          message: "Access denied: insufficient permissions",
          required: roles,
          role: req.user.role,
        });
      }

      next();
    } catch (error) {
      const status = error.status || 403;
      return res.status(status).json({ message: error.message || "Access denied" });
    }
  };
}

const requireAdmin = requireRoles("admin");
const requireMechanic = requireRoles("mechanic");
const requireStaff = requireRoles("admin", "mechanic");
const requireCustomer = requireRoles("customer");

module.exports = {
  loadUserRoles,
  requireRoles,
  requireAdmin,
  requireMechanic,
  requireStaff,
  requireCustomer,
};
