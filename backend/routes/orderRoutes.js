const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const invoiceController = require("../controllers/invoiceController");
const authenticateToken = require("../middleware/authMiddleware");
const authenticateAdmin = require("../middleware/adminAuthMiddleware");

router.post("/", authenticateToken, orderController.createOrder);
router.get("/mine", authenticateToken, orderController.getMyOrders);
router.get("/:id/invoice", authenticateToken, invoiceController.downloadInvoice);

router.get(
  "/",
  authenticateToken,
  authenticateAdmin,
  orderController.getOrders
);
router.get(
  "/:id",
  authenticateToken,
  orderController.getOrderById
);
router.put(
  "/:id",
  authenticateToken,
  authenticateAdmin,
  orderController.updateOrder
);
router.delete(
  "/:id",
  authenticateToken,
  authenticateAdmin,
  orderController.deleteOrder
);

module.exports = router;
