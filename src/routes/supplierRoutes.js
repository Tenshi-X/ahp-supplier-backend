const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Supplier
 *   description: Manajemen data supplier dan nilai kriteria
 */

/**
 * @swagger
 * /supplier:
 *   post:
 *     summary: Tambah supplier baru
 *     tags: [Supplier]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nama
 *               - alamat
 *               - contact
 *             properties:
 *               nama:
 *                 type: string
 *               alamat:
 *                 type: string
 *               contact:
 *                 type: string
 *               keterangan:
 *                 type: string
 *     responses:
 *       200:
 *         description: Supplier berhasil ditambahkan
 *       500:
 *         description: Gagal menambahkan supplier
 */
router.post(
  "/",
  protect,
  restrictTo("staff"),
  supplierController.createSupplier
);

/**
 * @swagger
 * /supplier:
 *   get:
 *     summary: Ambil semua supplier
 *     tags: [Supplier]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar supplier
 *       500:
 *         description: Gagal mengambil data supplier
 */
router.get(
  "/",
  protect,
  restrictTo("staff", "junior_manager"),
  supplierController.getAllSuppliers
);
/**
 * @swagger
 * /supplier/nama-supply:
 *   get:
 *     summary: Ambil semua nama_supply unik
 *     tags: [Supplier]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar nama_supply unik
 *       500:
 *         description: Gagal mengambil data
 */
router.get(
  "/:nama_supply/getBySupply",
  protect,
  restrictTo("staff", "junior_manager"),
  supplierController.getSuppliersBySupply
);

router.get(
  "/nama-supply",
  protect,
  restrictTo("staff", "junior_manager"),
  supplierController.getUniqueNamaSupply
);

/**
 * @swagger
 * /supplier/{id}:
 *   get:
 *     summary: Ambil detail supplier berdasarkan ID
 *     tags: [Supplier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detail supplier
 *       404:
 *         description: Supplier tidak ditemukan
 *       500:
 *         description: Gagal mengambil supplier
 */
router.get(
  "/:id",
  protect,
  restrictTo("staff", "junior_manager"),
  supplierController.getSupplierById
);

/**
 * @swagger
 * /supplier/{id}:
 *   put:
 *     summary: Perbarui data supplier
 *     tags: [Supplier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *               alamat:
 *                 type: string
 *               contact:
 *                 type: string
 *               keterangan:
 *                 type: string
 *     responses:
 *       200:
 *         description: Supplier berhasil diperbarui
 *       500:
 *         description: Gagal memperbarui supplier
 */
router.put(
  "/:id",
  protect,
  restrictTo("staff"),
  supplierController.updateSupplier
);

/**
 * @swagger
 * /supplier/{id}:
 *   delete:
 *     summary: Hapus supplier
 *     tags: [Supplier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Supplier berhasil dihapus
 *       500:
 *         description: Gagal menghapus supplier
 */
router.delete(
  "/:id",
  protect,
  restrictTo("staff"),
  supplierController.deleteSupplier
);

/**
 * @swagger
 * /supplier/{supplierId}/nilai-kriteria:
 *   post:
 *     summary: Tambah nilai kriteria untuk supplier
 *     tags: [Supplier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: supplierId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               namaKriteria:
 *                 type: string
 *               nilai:
 *                 type: number
 *     responses:
 *       200:
 *         description: Nilai kriteria berhasil ditambahkan
 *       500:
 *         description: Gagal menambahkan nilai kriteria
 */
router.post(
  "/:supplierId/nilai-kriteria",
  protect,
  restrictTo("staff"),
  supplierController.addNilaiKriteria
);

/**
 * @swagger
 * /supplier/{supplierId}/nilai-kriteria:
 *   get:
 *     summary: Ambil semua nilai kriteria dari supplier
 *     tags: [Supplier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: supplierId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Daftar nilai kriteria
 *       500:
 *         description: Gagal mengambil nilai kriteria
 */
router.get(
  "/:supplierId/nilai-kriteria",
  protect,
  restrictTo("staff", "junior_manager"),
  supplierController.getNilaiKriteriaBySupplier
);

/**
 * @swagger
 * /supplier/nilai-kriteria/{id}:
 *   put:
 *     summary: Perbarui nilai kriteria
 *     tags: [Supplier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               namaKriteria:
 *                 type: string
 *               nilai:
 *                 type: number
 *     responses:
 *       200:
 *         description: Nilai kriteria berhasil diperbarui
 *       500:
 *         description: Gagal memperbarui nilai kriteria
 */
router.put(
  "/nilai-kriteria/:id",
  protect,
  restrictTo("staff"),
  supplierController.updateNilaiKriteria
);

/**
 * @swagger
 * /supplier/nilai-kriteria/{id}:
 *   delete:
 *     summary: Hapus nilai kriteria
 *     tags: [Supplier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Nilai kriteria berhasil dihapus
 *       500:
 *         description: Gagal menghapus nilai kriteria
 */
router.delete(
  "/nilai-kriteria/:id",
  protect,
  restrictTo("staff"),
  supplierController.deleteNilaiKriteria
);

/**
 * @swagger
 * /supplier/{supplierId}/add-supply:
 *   post:
 *     summary: Tambah nama_supply dan maksimal_produksi baru ke supplier
 *     tags: [Supplier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: supplierId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nama_supply
 *               - maksimal_produksi
 *             properties:
 *               nama_supply:
 *                 type: string
 *               maksimal_produksi:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Supply berhasil ditambahkan ke supplier
 *       404:
 *         description: Supplier tidak ditemukan
 *       500:
 *         description: Gagal menambahkan supply
 */
router.post(
  "/:supplierId/add-supply",
  protect,
  restrictTo("staff"),
  supplierController.addSupplyToSupplier
);

/**
 * @swagger
 * /supplier/{supplierId}/supplies:
 *   get:
 *     summary: Ambil semua supply berdasarkan supplierId
 *     tags: [Supplier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: supplierId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar supply
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   supplier_id:
 *                     type: integer
 *                   nama_supply:
 *                     type: string
 *                   maksimal_produksi:
 *                     type: integer
 *       500:
 *         description: Gagal mengambil data supply
 */
router.get(
  "/:supplierId/supplies",
  protect,
  restrictTo("staff", "junior_manager"),
  supplierController.getSuppliesBySupplier
);

/**
 * @swagger
 * /supplier/supply/{id}:
 *   put:
 *     summary: Update data supply berdasarkan ID
 *     tags: [Supplier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nama_supply
 *               - maksimal_produksi
 *             properties:
 *               nama_supply:
 *                 type: string
 *               maksimal_produksi:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Supply berhasil diperbarui
 *       404:
 *         description: Supply tidak ditemukan
 *       500:
 *         description: Gagal memperbarui supply
 */
router.put(
  "/supply/:id",
  protect,
  restrictTo("staff"),
  supplierController.updateSupply
);

/**
 * @swagger
 * /supplier/supply/{id}:
 *   delete:
 *     summary: Hapus data supply berdasarkan ID
 *     tags: [Supplier]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Supply berhasil dihapus
 *       404:
 *         description: Supply tidak ditemukan
 *       500:
 *         description: Gagal menghapus supply
 */
router.delete(
  "/supply/:id",
  protect,
  restrictTo("staff"),
  supplierController.deleteSupply
);

module.exports = router;
