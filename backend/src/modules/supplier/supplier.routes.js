const express = require('express');
const router = express.Router();
const { requireRole } = require('../../middlewares/role.middlewares');
const supplierController = require('./supplier.controller');

/**
 * @swagger
 * /suppliers/create:
 *   post:
 *     summary: Create a supplier (Admin, Owner, or Manager)
 *     tags: [Suppliers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/SupplierBody'
 *               - type: object
 *                 required: [restaurantId]
 *                 properties:
 *                   restaurantId: { type: integer }
 *     responses:
 *       201:
 *         description: Supplier created
 *       500:
 *         description: Failed to create supplier
 */
router.post('/create', requireRole('Admin', 'Owner', 'Manager'), supplierController.createSupplier);

/**
 * @swagger
 * /suppliers/getAll:
 *   get:
 *     summary: List suppliers for a restaurant (defaults to the caller's own restaurant)
 *     tags: [Suppliers]
 *     parameters:
 *       - in: query
 *         name: restaurantId
 *         schema: { type: integer }
 *         description: Defaults to the caller's own restaurantId if omitted
 *     responses:
 *       200:
 *         description: Array of suppliers
 *       400:
 *         description: restaurantId is required
 *       500:
 *         description: Failed to fetch suppliers
 */
router.get('/getAll', supplierController.getAllSuppliers);

/**
 * @swagger
 * /suppliers/get/{id}:
 *   get:
 *     summary: Get a supplier by ID
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: The supplier
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Failed to fetch supplier
 */
router.get('/get/:id', supplierController.getSupplierById);

/**
 * @swagger
 * /suppliers/update/{id}:
 *   put:
 *     summary: Update a supplier (Admin, Owner, or Manager)
 *     tags: [Suppliers]
 *     description: Partial update — any field omitted or falsy keeps its existing value.
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
 *             $ref: '#/components/schemas/SupplierBody'
 *     responses:
 *       200:
 *         description: The updated supplier
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Failed to update supplier
 */
router.put('/update/:id', requireRole('Admin', 'Owner', 'Manager'), supplierController.updateSupplier);

/**
 * @swagger
 * /suppliers/delete/{id}:
 *   delete:
 *     summary: Delete a supplier (Admin or Owner)
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Supplier deleted successfully
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Failed to delete supplier
 */
router.delete('/delete/:id', requireRole('Admin', 'Owner'), supplierController.deleteSupplier);

module.exports = router;
