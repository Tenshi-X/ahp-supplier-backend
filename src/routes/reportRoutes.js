// routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

// Tim pengadaan membuat laporan
router.post(
  "/create",
  protect,
  restrictTo("tim_pengadaan"),
  reportController.createReport
);

// Junior manager melihat semua laporan dan menyetujui
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

module.exports = router;
