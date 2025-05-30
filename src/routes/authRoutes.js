const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoint untuk autentikasi user
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     description: Autentikasi user dan menghasilkan token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login berhasil
 *       401:
 *         description: Username atau password salah
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registrasi user baru
 *     description: Membuat akun baru untuk user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 example: staff
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *       400:
 *         description: Data tidak lengkap
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout user
 *     description: Menghapus sesi user yang sedang login
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout berhasil
 */
router.post("/logout", authController.logout);

module.exports = router;
