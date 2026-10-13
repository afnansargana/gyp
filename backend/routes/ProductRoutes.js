const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  upload,
} = require("../controllers/productController");
const authenticateToken = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/rbac.middleware");

// Public catalog reads
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin-only mutations
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  upload.single("image"),
  createProduct
);
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  upload.single("image"),
  updateProduct
);
router.delete("/:id", authenticateToken, requireAdmin, deleteProduct);

module.exports = router;
