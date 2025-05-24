const express = require("express");
const router = express.Router();
const supplyController = require("../controllers/supplyController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post(
  "/input",
  protect,
  restrictTo("staff"),
  supplyController.inputSupply
);

module.exports = router;
