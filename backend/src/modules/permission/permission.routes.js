const express = require("express");
const router = express.Router();
const { requireRole } = require("../../middlewares/role.middlewares");
const permissionController = require("./permission.controller");

/**
 * @swagger
 * /permissions/getAll:
 *   get:
 *     summary: List all permissions (Admin only)
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         description: Array of permissions
 *       500:
 *         description: Failed to fetch permissions
 */
router.get(
  "/getAll",
  requireRole("Admin"),
  permissionController.getAllPermissions,
);

/**
 * @swagger
 * /permissions/get/{id}:
 *   get:
 *     summary: Get a permission by ID (Admin only)
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: The permission
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Failed to fetch permission
 */
router.get(
  "/get/:id",
  requireRole("Admin"),
  permissionController.getPermissionById,
);

/**
 * @swagger
 * /permissions/create:
 *   post:
 *     summary: Create a permission (Admin only)
 *     tags: [Permissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Permission created
 *       400:
 *         description: Permission name is required, or a permission with this name already exists
 *       500:
 *         description: Failed to create permission
 */
router.post(
  "/create",
  requireRole("Admin"),
  permissionController.createPermission,
);

/**
 * @swagger
 * /permissions/update/{id}:
 *   put:
 *     summary: Update a permission (Admin only)
 *     tags: [Permissions]
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
 *               name: { type: string }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Permission updated
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Failed to update permission
 */
router.put(
  "/update/:id",
  requireRole("Admin"),
  permissionController.updatePermission,
);

/**
 * @swagger
 * /permissions/delete/{id}:
 *   delete:
 *     summary: Delete a permission (Admin only)
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Permission deleted successfully
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Failed to delete permission
 */
router.delete(
  "/delete/:id",
  requireRole("Admin"),
  permissionController.deletePermission,
);

module.exports = router;
