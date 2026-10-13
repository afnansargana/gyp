const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const aiController = require("../controllers/aiController");

router.post("/analyze", authenticateToken, aiController.analyze);

module.exports = router;
