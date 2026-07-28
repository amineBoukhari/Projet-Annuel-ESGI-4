const router = require("express").Router();
const authController = require("./auth.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

//router.post("/register",authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in with email and password
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Authenticated. Sets an httpOnly `token` cookie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id: { type: integer }
 *                     username: { type: string }
 *                     email: { type: string }
 *                     mustChangePassword: { type: boolean }
 *                     restaurantId: { type: integer, nullable: true }
 *                     role:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         name: { type: string }
 *       400:
 *         description: Invalid email or password
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/changePassword:
 *   post:
 *     summary: Change the current user's password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, oldPassword, newPassword]
 *             properties:
 *               id:
 *                 type: integer
 *               oldPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password changed. Issues a fresh `token` cookie.
 *       400:
 *         description: Invalid old password
 *       404:
 *         description: User not found
 */
router.post("/changePassword", authMiddleware, authController.changePassword);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out and clear the auth cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.post("/logout", authMiddleware, authController.logout);

module.exports = router;
