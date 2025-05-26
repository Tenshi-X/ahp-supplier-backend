const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post(
  "/",
  protect,
  restrictTo("staff"),
  supplierController.createSupplier
);

router.get(
  "/",
  protect,
  restrictTo("staff", "junior_manager"),
  supplierController.getAllSuppliers
);

router.get(
  "/:id",
  protect,
  restrictTo("staff", "junior_manager"),
  supplierController.getSupplierById
);

router.put(
  "/:id",
  protect,
  restrictTo("staff"),
  supplierController.updateSupplier
);

router.delete(
  "/:id",
  protect,
  restrictTo("staff"),
  supplierController.deleteSupplier
);

// Nilai Kriteria Supplier
router.post(
  "/:supplierId/nilai-kriteria",
  protect,
  restrictTo("staff"),
  supplierController.addNilaiKriteria
);

router.get(
  "/:supplierId/nilai-kriteria",
  protect,
  restrictTo("staff", "junior_manager"),
  supplierController.getNilaiKriteriaBySupplier
);

router.put(
  "/nilai-kriteria/:id",
  protect,
  restrictTo("staff"),
  supplierController.updateNilaiKriteria
);

router.delete(
  "/nilai-kriteria/:id",
  protect,
  restrictTo("staff"),
  supplierController.deleteNilaiKriteria
);

module.exports = router;
