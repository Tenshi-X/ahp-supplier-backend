const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// CRUD Supplier (akses tim_pengadaan)
router.post(
  "/",
  protect,
  restrictTo("tim_pengadaan"),
  supplierController.createSupplier
);

router.get(
  "/",
  protect,
  restrictTo("tim_pengadaan", "junior_manager"),
  supplierController.getAllSuppliers
);

router.get(
  "/:id",
  protect,
  restrictTo("tim_pengadaan", "junior_manager"),
  supplierController.getSupplierById
);

router.put(
  "/:id",
  protect,
  restrictTo("tim_pengadaan"),
  supplierController.updateSupplier
);

router.delete(
  "/:id",
  protect,
  restrictTo("tim_pengadaan"),
  supplierController.deleteSupplier
);

module.exports = router;
