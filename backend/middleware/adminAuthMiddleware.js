/**
 * Backwards-compatible admin guard.
 * Prefer: authenticateToken + requireAdmin from rbac.middleware.js
 */
const { requireAdmin } = require("./rbac.middleware");

module.exports = requireAdmin;
