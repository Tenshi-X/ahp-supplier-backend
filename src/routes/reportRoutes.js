const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post(
  "/create",
  protect,
  restrictTo("staff"),
  reportController.createReport
);

router.get(
  "/",
  protect,
  restrictTo("junior_manager"),
  reportController.getAllReports
);

router.put(
  "/:report_id/approval",
  protect,
  restrictTo("junior_manager"),
  reportController.updateApproval
);

router.get(
  "/:report_id/pdf",
  protect,
  restrictTo("staff", "junior_manager"),
  reportController.generatePDF
);

module.exports = router;
