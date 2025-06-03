const express = require("express");
const router = express.Router();
const ahpController = require("../controllers/ahpController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post(
  "/calculate-ahp",
  protect,
  restrictTo("staff"),
  ahpController.calculateAHP
);
