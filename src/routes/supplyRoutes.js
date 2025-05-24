// routes/supplyRoutes.js
const express = require("express");
const router = express.Router();
const supplyController = require("../controllers/supplyController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post(
  "/input",
  protect,
  restrictTo("tim_pengadaan"),
  supplyController.inputSupply
);

module.exports = router;
