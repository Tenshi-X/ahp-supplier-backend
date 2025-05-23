const express = require("express");
const router = express.Router();
const ahpController = require("../controllers/ahpController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.get(
  "/:supply_id",
  protect,
  restrictTo("tim_pengadaan"),
  ahpController.calculateAHP
);

module.exports = router;
