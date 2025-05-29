const express = require("express");
const router = express.Router();
const kriteriaController = require("../controllers/kriteriaController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// CRUD Kriteria (akses tim_pengadaan)
router.post(
  "/",
  protect,
  restrictTo("tim_pengadaan"),
  kriteriaController.createKriteria
);
router.get(
  "/",
  protect,
  restrictTo("tim_pengadaan", "junior_manager"),
  kriteriaController.getAllKriteria
);
router.get(
  "/:id",
  protect,
  restrictTo("tim_pengadaan", "junior_manager"),
  kriteriaController.getKriteriaById
);
router.put(
  "/:id",
  protect,
  restrictTo("tim_pengadaan"),
  kriteriaController.updateKriteria
);
router.delete(
  "/:id",
  protect,
  restrictTo("tim_pengadaan"),
  kriteriaController.deleteKriteria
);

module.exports = router;
