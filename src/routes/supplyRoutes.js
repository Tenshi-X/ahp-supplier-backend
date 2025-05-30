const express = require("express");
const router = express.Router();
const supplyController = require("../controllers/supplyController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: CatatanSupply
 *   description: Manajemen catatan kebutuhan supply
 */

/**
 * @swagger
 * /supply/input:
 *   post:
 *     summary: Input kebutuhan supply
 *     description: Menambahkan catatan kebutuhan supply (khusus staff)
 *     tags: [CatatanSupply]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nama_barang
 *               - jumlah
 *             properties:
 *               nama_pemesan:
 *                 type: string
 *               no_hp:
 *                 type: string
 *               nama_kebutuhan:
 *                 type: string
 *               jumlah_kebutuhan:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Kebutuhan supply berhasil diinput
 *       500:
 *         description: Gagal input kebutuhan supply
 */
router.post(
  "/input",
  protect,
  restrictTo("staff"),
  supplyController.inputSupply
);

/**
 * @swagger
 * /supply:
 *   get:
 *     summary: Ambil semua catatan supply
 *     description: Mengambil semua catatan kebutuhan supply dari seluruh staff (akses untuk staff dan junior_manager)
 *     tags: [CatatanSupply]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar supply berhasil diambil
 *       500:
 *         description: Gagal mengambil data supply
 */
router.get(
  "/",
  protect,
  restrictTo("staff", "junior_manager"),
  supplyController.getAllSupply
);

/**
 * @swagger
 * /supply/{id}:
 *   get:
 *     summary: Ambil satu catatan supply
 *     description: Mengambil satu catatan kebutuhan supply berdasarkan ID (akses untuk staff dan junior_manager)
 *     tags: [CatatanSupply]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID catatan supply
 *     responses:
 *       200:
 *         description: Data supply berhasil diambil
 *       404:
 *         description: Supply tidak ditemukan
 *       500:
 *         description: Gagal mengambil data supply
 */
router.get(
  "/:id",
  protect,
  restrictTo("staff", "junior_manager"),
  supplyController.getSupplyById
);

/**
 * @swagger
 * /supply/{id}:
 *   put:
 *     summary: Update catatan supply
 *     description: Mengubah data kebutuhan supply (khusus staff)
 *     tags: [CatatanSupply]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID catatan supply
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_pemesan:
 *                 type: string
 *               no_hp:
 *                 type: string
 *               nama_kebutuhan:
 *                 type: string
 *               jumlah_kebutuhan:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Supply berhasil diperbarui
 *       500:
 *         description: Gagal memperbarui supply
 */
router.put("/:id", protect, restrictTo("staff"), supplyController.updateSupply);

/**
 * @swagger
 * /supply/{id}:
 *   delete:
 *     summary: Hapus catatan supply
 *     description: Menghapus catatan kebutuhan supply berdasarkan ID (khusus staff)
 *     tags: [CatatanSupply]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID catatan supply
 *     responses:
 *       200:
 *         description: Supply berhasil dihapus
 *       500:
 *         description: Gagal menghapus supply
 */
router.delete(
  "/:id",
  protect,
  restrictTo("staff"),
  supplyController.deleteSupply
);

module.exports = router;
