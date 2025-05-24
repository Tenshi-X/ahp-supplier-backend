const express = require("express");
const router = express.Router();
const ahpController = require("../controllers/ahpController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.get(
  "/:supply_id",
  protect,
  restrictTo("staff"),
  ahpController.calculateAHP
);

module.exports = router;
