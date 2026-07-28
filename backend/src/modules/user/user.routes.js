const express = require("express");
const router = express.Router();
const { requireRole } = require("../../middlewares/role.middlewares");

const userController = require("./user.controller");
const checkAuth = require("../../middlewares/auth.middleware");

/**
 * @swagger
 * /users/createUser:
 *   post:
 *     summary: Create a user with the default Employee role (Admin, Owner, or Manager only)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserBody'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing restaurantId, or a user with this email already exists
 *       500:
 *         description: Failed to create user
 */
router.post(
  "/createUser",
  requireRole("Admin", "Owner", "Manager"),
  userController.createUser,
);

/**
 * @swagger
 * /users/createOwner:
 *   post:
 *     summary: Create a user with the Owner role (Admin or Owner only)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserBody'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing restaurantId, or a user with this email already exists
 *       500:
 *         description: Failed to create user
 */
router.post(
  "/createOwner",
  requireRole("Admin", "Owner"),
  userController.createUser,
);

/**
 * @swagger
 * /users/createManager:
 *   post:
 *     summary: Create a user with the Manager role (Admin or Owner only)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserBody'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing restaurantId, or a user with this email already exists
 *       500:
 *         description: Failed to create user
 */
router.post(
  "/createManager",
  requireRole("Admin", "Owner"),
  userController.createUser,
);

/**
 * @swagger
 * /users/createEmployee:
 *   post:
 *     summary: Create a user with the Employee role (Admin, Owner, or Manager only)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserBody'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing restaurantId, or a user with this email already exists
 *       500:
 *         description: Failed to create user
 */
router.post(
  "/createEmployee",
  requireRole("Admin", "Owner", "Manager"),
  userController.createUser,
);

/**
 * @swagger
 * /users/get/{id}:
 *   get:
 *     summary: Get a user by ID (password and roleId excluded)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: The user
 *       404:
 *         description: User not found
 *       500:
 *         description: Error while fetching user
 */
router.get("/get/:id", userController.getUSerWithId);

/**
 * @swagger
 * /users/getMe:
 *   get:
 *     summary: Get the currently authenticated user's own profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The current user's profile, including role
 *       404:
 *         description: User not found
 *       500:
 *         description: Error while fetching profile
 */
router.get("/getMe", checkAuth, userController.getMyProfile); // Verifier que c'est bien le bon user

/**
 * @swagger
 * /users/getAll:
 *   get:
 *     summary: List users (Admin, Owner, or Manager only). Admins see all, others see only their restaurant.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Array of users, or a message object if none exist
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: array
 *                   items: { type: object }
 *                 - type: object
 *                   properties:
 *                     message: { type: string, example: "no user was found" }
 */
router.get(
  "/getAll",
  requireRole("Admin", "Owner", "Manager"),
  userController.getAllUsers,
);

/**
 * @swagger
 * /users/delete/{id}:
 *   delete:
 *     summary: Delete a user by ID (Admin, Owner, or Manager only)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to delete user
 */
router.delete(
  "/delete/:id",
  requireRole("Admin", "Owner", "Manager"),
  userController.deleteUser,
);

/**
 * @swagger
 * /users/update/{id}:
 *   put:
 *     summary: Update the current user's own username/email
 *     tags: [Users]
 *     description: "Note: the id path param is accepted but unused — the update always targets the authenticated caller (req.user.id)."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               email: { type: string, format: email }
 *     responses:
 *       200:
 *         description: The updated user
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to update user
 */
router.put("/update/:id", checkAuth, userController.updateUser);

/**
 * @swagger
 * /users/updateRole/{id}:
 *   put:
 *     summary: Change a user's role (Admin, Owner, or Manager only)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [newRole]
 *             properties:
 *               newRole:
 *                 description: Either the numeric role ID or the role name (case-insensitive)
 *                 oneOf:
 *                   - { type: integer, example: 3 }
 *                   - { type: string, example: Manager }
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Invalid role value
 *       404:
 *         description: User not found
 *       500:
 *         description: Error while updating user role
 */
router.put(
  "/updateRole/:id",
  requireRole("Admin", "Owner", "Manager"),
  userController.updateRole,
);

module.exports = router;
