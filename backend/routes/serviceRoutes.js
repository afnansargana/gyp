const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const authenticateToken = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/rbac.middleware");

// Authenticated users can list services (booking flow)
router.get("/", authenticateToken, serviceController.getServices);

// Admin-only mutations
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  serviceController.createService
);
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  serviceController.updateService
);
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  serviceController.deleteService
);

module.exports = router;
