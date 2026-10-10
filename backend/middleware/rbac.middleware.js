const User = require("../models/User");

/**
 * Resolve a stable role string from user flags.
 * Priority: admin > mechanic > customer
 */
function resolveRole(user) {
  if (!user) return "guest";
  if (user.isAdmin) return "admin";
  if (user.isMechanic) return "mechanic";
  return "customer";
}

/**
 * Normalize JWT / document user onto req.auth
 */
function attachAuthContext(req, decodedOrUser) {
  const userId =
    decodedOrUser.userId ||
    decodedOrUser._id ||
    (decodedOrUser.id ? String(decodedOrUser.id) : null);

  const isAdmin = !!decodedOrUser.isAdmin;
  const isMechanic = !!decodedOrUser.isMechanic;

  req.user = {
    ...decodedOrUser,
    userId: userId ? String(userId) : undefined,
    isAdmin,
    isMechanic,
  };

  req.auth = {
    userId: req.user.userId,
    isAdmin,
    isMechanic,
    role: resolveRole({ isAdmin, isMechanic }),
  };
}

/**
 * Load fresh roles from DB (prevents stale/forged JWT role claims).
 * Call after authenticateToken when privilege checks matter.
 */
async function hydrateUserRoles(req, res, next) {
  try {
    const userId = req.auth?.userId || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select(
      "isAdmin isMechanic isVerified username email"
    );
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.isVerified === false) {
      return res.status(403).json({
        message: "Email not verified",
        requiresOtp: true,
        email: user.email,
      });
    }

    attachAuthContext(req, {
      userId: user._id,
      isAdmin: user.isAdmin,
      isMechanic: user.isMechanic,
      username: user.username,
      email: user.email,
    });

    req.dbUser = user;
    next();
  } catch (error) {
    console.error("[rbac] hydrateUserRoles:", error.message);
    return res.status(500).json({ message: "Authorization error" });
  }
}

/**
 * Require one of the given roles after hydrateUserRoles (or JWT flags).
 * @param {...('admin'|'mechanic'|'customer')} roles
 */
function requireRoles(...roles) {
  return (req, res, next) => {
    const role = req.auth?.role || resolveRole(req.user);
    if (!roles.includes(role)) {
      return res.status(403).json({
        message: "Forbidden: insufficient privileges",
        required: roles,
        role,
      });
    }
    next();
  };
}

const requireAdmin = [hydrateUserRoles, requireRoles("admin")];
const requireMechanic = [hydrateUserRoles, requireRoles("mechanic")];
const requireStaff = [hydrateUserRoles, requireRoles("admin", "mechanic")];

module.exports = {
  resolveRole,
  attachAuthContext,
  hydrateUserRoles,
  requireRoles,
  requireAdmin,
  requireMechanic,
  requireStaff,
};
