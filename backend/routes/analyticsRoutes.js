const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const { requireAdmin, requireMechanic } = require("../middleware/rbac.middleware");
const analyticsController = require("../controllers/analyticsController");

router.get("/overview", authenticateToken, requireAdmin, analyticsController.getOverview);
router.get(
  "/mechanic",
  authenticateToken,
  requireMechanic,
  analyticsController.getMechanicOverview
);

module.exports = router;
