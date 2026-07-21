const express = require('express');
const router = express.Router();
const { requireRole } = require('../../middlewares/role.middlewares');
const purchaseReturnController = require('./purchaseReturn.controller');

/**
 * @swagger
 * /purchaseReturns/create:
 *   post:
 *     summary: "NOT IMPLEMENTED: create a purchase return (Admin, Owner, or Manager)"
 *     tags: [Purchase Returns]
 *     description: >
 *       The controller is currently an empty TODO stub — it never sends a response, so this request
 *       will hang until timeout. Intended eventually to create a PurchaseReturn + items and a negative
 *       StockMovement per ingredient ("Return to Supplier").
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Planned shape, not yet read by the controller
 *             properties:
 *               supplierId: { type: integer }
 *               restaurantId: { type: integer }
 *               purchaseOrderId: { type: integer }
 *               notes: { type: string }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ingredientId: { type: integer }
 *                     quantity: { type: number }
 *                     reason: { type: string }
 *     responses:
 *       default:
 *         description: No response is ever sent (unimplemented)
 */
router.post('/create', requireRole('Admin', 'Owner', 'Manager'), purchaseReturnController.createPurchaseReturn);

module.exports = router;
