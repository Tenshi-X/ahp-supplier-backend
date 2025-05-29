const express = require("express");
const router = express.Router();
const kriteriaController = require("../controllers/kriteriaController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Kriteria
 *   description: Manajemen data kriteria penilaian
 */

/**
 * @swagger
 * /kriteria:
 *   post:
 *     summary: Tambah kriteria
 *     description: Menambahkan data kriteria baru (khusus role staff)
 *     tags: [Kriteria]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - kode
 *               - nama
 *             properties:
 *               kode:
 *                 type: string
 *               nama:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kriteria berhasil ditambahkan
 *       500:
 *         description: Gagal menambahkan kriteria
 */
router.post(
  "/",
  protect,
  restrictTo("staff"),
  kriteriaController.createKriteria
);

/**
 * @swagger
 * /kriteria:
 *   get:
 *     summary: Ambil semua kriteria
 *     description: Mengambil seluruh data kriteria (staff dan junior_manager)
 *     tags: [Kriteria]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar semua kriteria
 *       500:
 *         description: Gagal mengambil data kriteria
 */
router.get(
  "/",
  protect,
  restrictTo("staff", "junior_manager"),
  kriteriaController.getAllKriteria
);

/**
 * @swagger
 * /kriteria/{id}:
 *   get:
 *     summary: Ambil kriteria berdasarkan ID
 *     description: Mengambil satu data kriteria berdasarkan ID-nya
 *     tags: [Kriteria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID kriteria
 *     responses:
 *       200:
 *         description: Data kriteria ditemukan
 *       404:
 *         description: Kriteria tidak ditemukan
 *       500:
 *         description: Gagal mengambil kriteria
 */
router.get(
  "/:id",
  protect,
  restrictTo("staff", "junior_manager"),
  kriteriaController.getKriteriaById
);

/**
 * @swagger
 * /kriteria/{id}:
 *   put:
 *     summary: Perbarui data kriteria
 *     description: Memperbarui data kriteria berdasarkan ID (khusus role staff)
 *     tags: [Kriteria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID kriteria yang akan diperbarui
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kode:
 *                 type: string
 *               nama:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kriteria berhasil diperbarui
 *       500:
 *         description: Gagal memperbarui kriteria
 */
router.put(
  "/:id",
  protect,
  restrictTo("staff"),
  kriteriaController.updateKriteria
);

/**
 * @swagger
 * /kriteria/{id}:
 *   delete:
 *     summary: Hapus kriteria
 *     description: Menghapus data kriteria berdasarkan ID (khusus role staff)
 *     tags: [Kriteria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID kriteria yang akan dihapus
 *     responses:
 *       200:
 *         description: Kriteria berhasil dihapus
 *       500:
 *         description: Gagal menghapus kriteria
 */
router.delete(
  "/:id",
  protect,
  restrictTo("staff"),
  kriteriaController.deleteKriteria
);

module.exports = router;
