const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Laporan
 *   description: Manajemen laporan pengadaan dan proses AHP
 */

/**
 * @swagger
 * /report/create:
 *   post:
 *     summary: Buat laporan pengadaan
 *     description: Membuat laporan supply, menyimpan used criteria, dan menghitung ranking supplier (khusus role staff)
 *     tags: [Laporan]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - catatan_supply_id
 *               - file_path
 *               - usedCriteria
 *             properties:
 *               catatan_supply_id:
 *                 type: integer
 *               file_path:
 *                 type: string
 *               catatan_validasi:
 *                 type: string
 *               usedCriteria:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     criteriaName:
 *                       type: string
 *                     criteriaValue:
 *                       type: number
 *     responses:
 *       200:
 *         description: Laporan berhasil dibuat dan perhitungan AHP selesai
 *       500:
 *         description: Gagal membuat laporan
 */
router.post(
  "/create",
  protect,
  restrictTo("staff"),
  reportController.createReport
);

/**
 * @swagger
 * /report:
 *   get:
 *     summary: Ambil semua laporan
 *     description: Mengambil seluruh data laporan yang sudah dibuat (khusus role junior_manager)
 *     tags: [Laporan]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar laporan berhasil diambil
 *       500:
 *         description: Gagal mengambil laporan
 */
router.get(
  "/",
  protect,
  restrictTo("junior_manager"),
  reportController.getAllReports
);

/**
 * @swagger
 * /report/by-catatan/{catatan_supply_id}:
 *   get:
 *     summary: Ambil laporan berdasarkan catatan supply ID
 *     description: Mengambil data laporan yang berhubungan dengan catatan supply tertentu
 *     tags: [Laporan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: catatan_supply_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID catatan supply
 *     responses:
 *       200:
 *         description: Laporan ditemukan
 *       404:
 *         description: Laporan tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan saat mengambil data
 */
router.get(
  "/by-catatan/:catatan_supply_id",
  protect,
  reportController.getReportByCatatanId
);


/**
 * @swagger
 * /report/{report_id}/approval:
 *   put:
 *     summary: Update status persetujuan laporan
 *     description: Mengubah status persetujuan dan catatan validasi laporan (khusus role junior_manager)
 *     tags: [Laporan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: report_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID laporan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               catatan_validasi:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status laporan diperbarui
 *       500:
 *         description: Gagal memperbarui status laporan
 */
router.put(
  "/:report_id/approval",
  protect,
  restrictTo("junior_manager"),
  reportController.updateApproval
);

/**
 * @swagger
 * /report/{report_id}/pdf:
 *   get:
 *     summary: Generate file PDF laporan
 *     description: Membuat dan mengunduh file PDF laporan berdasarkan ID (staff dan junior_manager)
 *     tags: [Laporan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: report_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID laporan
 *     responses:
 *       200:
 *         description: PDF berhasil dibuat
 *     responses:
         200:
           description: PDF berhasil dibuat
           content:
            application/json:
             schema:
              type: object
              properties:
               message:
                type: string
                example: PDF berhasil dibuat
               url:
                type: string
                example: http://localhost:5000/pdf/laporan_report_1.pdf
 *       500:
 *         description: Gagal membuat PDF
 * 
 */
router.get(
  "/:report_id/pdf",
  protect,
  restrictTo("staff", "junior_manager"),
  reportController.generatePDF
);

module.exports = router;
