const express = require("express");
const router = express.Router();
const kriteriaController = require("../controllers/kriteriaController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// CRUD Kriteria (akses staff)
router.post(
  "/",
  protect,
  restrictTo("staff"),
  kriteriaController.createKriteria
);
router.get(
  "/",
  protect,
  restrictTo("staff", "junior_manager"),
  kriteriaController.getAllKriteria
);
router.get(
  "/:id",
  protect,
  restrictTo("staff", "junior_manager"),
  kriteriaController.getKriteriaById
);
router.put(
  "/:id",
  protect,
  restrictTo("staff"),
  kriteriaController.updateKriteria
);
router.delete(
  "/:id",
  protect,
  restrictTo("staff"),
  kriteriaController.deleteKriteria
);

module.exports = router;
