const express = require("express");
const router = express.Router();
const supplyController = require("../controllers/supplyController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// CREATE
router.post(
  "/input",
  protect,
  restrictTo("staff"),
  supplyController.inputSupply
);

// READ ALL
router.get(
  "/",
  protect,
  restrictTo("staff", "junior_manager"),
  supplyController.getAllSupply
);

// READ BY ID
router.get(
  "/:id",
  protect,
  restrictTo("staff", "junior_manager"),
  supplyController.getSupplyById
);

// UPDATE
router.put("/:id", protect, restrictTo("staff"), supplyController.updateSupply);

// DELETE
router.delete(
  "/:id",
  protect,
  restrictTo("staff"),
  supplyController.deleteSupply
);

module.exports = router;
