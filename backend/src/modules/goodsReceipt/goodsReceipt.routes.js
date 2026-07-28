const express = require('express');
const router = express.Router();
const { requireRole } = require('../../middlewares/role.middlewares');
const goodsReceiptController = require('./goodsReceipt.controller');

/**
 * @swagger
 * /goodsReceipts/create:
 *   post:
 *     summary: Create a goods receipt (draft), optionally linked to a purchase order (Admin, Owner, or Manager)
 *     tags: [Goods Receipts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               purchaseOrderId: { type: integer, description: Optional — links this receipt to an existing PO }
 *               supplierId: { type: integer, description: Defaults to the linked PO's supplier if omitted }
 *               restaurantId: { type: integer }
 *               receiptDate: { type: string, format: date, description: Defaults to now }
 *               notes: { type: string }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ingredientId: { type: integer }
 *                     expectedQuantity: { type: number }
 *                     receivedQuantity: { type: number }
 *                     unitPrice: { type: number, default: 0 }
 *                     notes: { type: string }
 *                     expirationDate: { type: string, format: date }
 *     responses:
 *       201:
 *         description: Goods receipt created with status "draft"
 *       404:
 *         description: purchaseOrderId was provided but that purchase order doesn't exist
 *       500:
 *         description: Failed to create goods receipt
 */
router.post('/create', requireRole('Admin', 'Owner', 'Manager'), goodsReceiptController.createGoodsReceipt);

/**
 * @swagger
 * /goodsReceipts/getAll:
 *   get:
 *     summary: List goods receipts (newest first)
 *     tags: [Goods Receipts]
 *     description: Non-admins are always restricted to their own restaurant, regardless of the restaurantId query param.
 *     parameters:
 *       - in: query
 *         name: restaurantId
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Array of goods receipts with items and linked purchase order
 *       500:
 *         description: Failed to fetch goods receipts
 */
router.get('/getAll', goodsReceiptController.getAllGoodsReceipts);

/**
 * @swagger
 * /goodsReceipts/get/{id}:
 *   get:
 *     summary: Get a goods receipt by ID, including items and linked purchase order
 *     tags: [Goods Receipts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: The goods receipt
 *       404:
 *         description: Goods receipt not found
 *       500:
 *         description: Failed to fetch goods receipt
 */
router.get('/get/:id', goodsReceiptController.getGoodsReceiptById);

/**
 * @swagger
 * /goodsReceipts/update/{id}:
 *   put:
 *     summary: Update a draft goods receipt's notes and/or replace its items (Admin, Owner, or Manager)
 *     tags: [Goods Receipts]
 *     description: Only allowed while status is "draft" — 400 if the receipt has already been validated. Providing items replaces all existing items.
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
 *               notes: { type: string }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ingredientId: { type: integer }
 *                     expectedQuantity: { type: number }
 *                     receivedQuantity: { type: number }
 *                     unitPrice: { type: number, default: 0 }
 *                     notes: { type: string }
 *     responses:
 *       200:
 *         description: The updated goods receipt
 *       400:
 *         description: Cannot update a validated receipt
 *       404:
 *         description: Goods receipt not found
 *       500:
 *         description: Failed to update goods receipt
 */
router.put('/update/:id', requireRole('Admin', 'Owner', 'Manager'), goodsReceiptController.updateGoodsReceipt);

/**
 * @swagger
 * /goodsReceipts/validate/{id}:
 *   put:
 *     summary: Validate a goods receipt — adds received quantities to ingredient stock and updates the linked PO's status (Admin, Owner, or Manager)
 *     tags: [Goods Receipts]
 *     description: >
 *       Increments stockQuantity on every received ingredient. If linked to a purchase order, compares received
 *       vs expected quantities to set the receipt status to "received" (all received), "partial" (some), or
 *       "rejected" (none) — and mirrors that onto the PO's status (Received / Partially Received / Rejected).
 *       400 if this receipt was already validated.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: The validated goods receipt with its new status
 *       400:
 *         description: Goods receipt already validated
 *       404:
 *         description: Goods receipt not found
 *       500:
 *         description: Failed to validate goods receipt
 */
router.put('/validate/:id', requireRole('Admin', 'Owner', 'Manager'), goodsReceiptController.validateGoodsReceipt);

/**
 * @swagger
 * /goodsReceipts/delete/{id}:
 *   delete:
 *     summary: Delete a draft goods receipt (Admin or Owner)
 *     tags: [Goods Receipts]
 *     description: Only allowed while status is "draft" — 400 if already validated.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Goods receipt deleted successfully
 *       400:
 *         description: Cannot delete a validated receipt
 *       404:
 *         description: Goods receipt not found
 *       500:
 *         description: Failed to delete goods receipt
 */
router.delete('/delete/:id', requireRole('Admin', 'Owner'), goodsReceiptController.deleteGoodsReceipt);

module.exports = router;
