const express = require("express");
const router = express.Router();
const rankingController = require("../controllers/rankingController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Ranking
 *   description: Endpoint terkait perhitungan AHP seperti used criteria dan ranking supplier
 */

/**
 * @swagger
 * /ranking/usedcriteria/{reportId}:
 *   get:
 *     summary: Ambil used criteria berdasarkan report ID
 *     description: Mengambil data kriteria yang digunakan dalam laporan tertentu
 *     tags: [Ranking]
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID dari laporan
 *     responses:
 *       200:
 *         description: Daftar used criteria berhasil diambil
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.get(
  "/usedcriteria/:reportId",
  protect,
  restrictTo("staff", "junior_manager"),
  rankingController.getUsedCriteriaByReport
);

/**
 * @swagger
 * /ranking/rankingsuppliers/{reportId}:
 *   get:
 *     summary: Ambil ranking supplier berdasarkan report ID
 *     description: Mengambil hasil perankingan supplier untuk laporan tertentu
 *     tags: [Ranking]
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID dari laporan
 *     responses:
 *       200:
 *         description: Daftar ranking supplier berhasil diambil
 *       500:
 *         description: Terjadi kesalahan pada server
 */
router.get(
  "/rankingsuppliers/:reportId",
  protect,
  restrictTo("staff", "junior_manager"),
  rankingController.getRankingSuppliersByReport
);

module.exports = router;
