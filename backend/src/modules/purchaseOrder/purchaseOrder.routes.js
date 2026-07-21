const express = require('express');
const router = express.Router();
const { requireRole } = require('../../middlewares/role.middlewares');
const purchaseOrderController = require('./purchaseOrder.controller');

/**
 * @swagger
 * /purchaseOrders/create:
 *   post:
 *     summary: Create a purchase order, optionally with line items (Admin, Owner, or Manager)
 *     tags: [Purchase Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               supplierId: { type: integer }
 *               restaurantId: { type: integer }
 *               orderDate: { type: string, format: date }
 *               expectedDeliveryDate: { type: string, format: date }
 *               notes: { type: string }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ingredientId: { type: integer }
 *                     quantity: { type: number }
 *                     unitPrice: { type: number }
 *     responses:
 *       201:
 *         description: Purchase order created
 *       500:
 *         description: Failed to create purchase order
 */
router.post('/create', requireRole('Admin', 'Owner', 'Manager'), purchaseOrderController.createPurchaseOrder);

/**
 * @swagger
 * /purchaseOrders/getAll:
 *   get:
 *     summary: List purchase orders (with items) for a restaurant, defaults to the caller's own
 *     tags: [Purchase Orders]
 *     parameters:
 *       - in: query
 *         name: restaurantId
 *         schema: { type: integer }
 *         description: Defaults to the caller's own restaurantId if omitted
 *     responses:
 *       200:
 *         description: Array of purchase orders including their items
 *       400:
 *         description: restaurantId is required
 *       500:
 *         description: Failed to fetch purchase orders
 */
router.get('/getAll', purchaseOrderController.getAllPurchaseOrders);

/**
 * @swagger
 * /purchaseOrders/get/{id}:
 *   get:
 *     summary: Get a purchase order by ID, including its items
 *     tags: [Purchase Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: The purchase order with items
 *       404:
 *         description: Purchase order not found
 *       500:
 *         description: Failed to fetch purchase order
 */
router.get('/get/:id', purchaseOrderController.getPurchaseOrderById);

/**
 * @swagger
 * /purchaseOrders/update/{id}:
 *   put:
 *     summary: Update a purchase order (Admin, Owner, or Manager)
 *     tags: [Purchase Orders]
 *     description: Partial update — any field omitted or falsy keeps its existing value. Does not touch line items.
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
 *               supplierId: { type: integer }
 *               orderDate: { type: string, format: date }
 *               expectedDeliveryDate: { type: string, format: date }
 *               notes: { type: string }
 *               status: { type: string }
 *     responses:
 *       200:
 *         description: The updated purchase order
 *       404:
 *         description: Purchase order not found
 *       500:
 *         description: Failed to update purchase order
 */
router.put('/update/:id', requireRole('Admin', 'Owner', 'Manager'), purchaseOrderController.updatePurchaseOrder);

/**
 * @swagger
 * /purchaseOrders/updateStatus/{id}:
 *   put:
 *     summary: Update only a purchase order's status (Admin, Owner, or Manager)
 *     tags: [Purchase Orders]
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
 *               status: { type: string }
 *     responses:
 *       200:
 *         description: The updated purchase order
 *       404:
 *         description: Purchase order not found
 *       500:
 *         description: Failed to update purchase order status
 */
router.put('/updateStatus/:id', requireRole('Admin', 'Owner', 'Manager'), purchaseOrderController.updatePurchaseOrderStatus);

/**
 * @swagger
 * /purchaseOrders/receive/{id}:
 *   post:
 *     summary: Mark a purchase order as Received and add its item quantities to ingredient stock (Admin, Owner, or Manager)
 *     tags: [Purchase Orders]
 *     description: Sets status to "Received" and increments stockQuantity on every ingredient referenced by this order's items.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: The purchase order, now marked Received
 *       404:
 *         description: Purchase order not found
 *       500:
 *         description: Failed to receive purchase order
 */
router.post('/receive/:id', requireRole('Admin', 'Owner', 'Manager'), purchaseOrderController.receivePurchaseOrder);

/**
 * @swagger
 * /purchaseOrders/delete/{id}:
 *   delete:
 *     summary: Delete a purchase order (Admin or Owner)
 *     tags: [Purchase Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Purchase order deleted successfully
 *       404:
 *         description: Purchase order not found
 *       500:
 *         description: Failed to delete purchase order
 */
router.delete('/delete/:id', requireRole('Admin', 'Owner'), purchaseOrderController.deletePurchaseOrder);

module.exports = router;
