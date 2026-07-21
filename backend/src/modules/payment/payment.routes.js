const express = require('express');
const router = express.Router();
const { requireRole } = require('../../middlewares/role.middlewares');
const paymentController = require('./payment.controller');

/**
 * @swagger
 * /payments/create:
 *   post:
 *     summary: "NOT IMPLEMENTED: record a supplier payment (Admin, Owner, or Manager)"
 *     tags: [Payments]
 *     description: >
 *       The controller is an empty TODO stub — no response is ever sent, so this request will hang
 *       until timeout. Note: Payment records ARE created elsewhere in the app (invoice pay/quickCreate
 *       flows) — this specific endpoint for supplier payments just isn't built yet.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Planned shape, not yet read by the controller
 *             properties:
 *               supplierId: { type: integer }
 *               purchaseOrderId: { type: integer }
 *               restaurantId: { type: integer }
 *               amount: { type: number }
 *               method: { type: string }
 *               status: { type: string }
 *               dueDate: { type: string, format: date }
 *               reference: { type: string }
 *     responses:
 *       default:
 *         description: No response is ever sent (unimplemented)
 */
router.post('/create', requireRole('Admin', 'Owner', 'Manager'), paymentController.createPayment);

/**
 * @swagger
 * /payments/supplier/{supplierId}:
 *   get:
 *     summary: "NOT IMPLEMENTED: list payments for a supplier"
 *     tags: [Payments]
 *     description: The controller is an empty TODO stub — no response is ever sent, so this request will hang until timeout.
 *     parameters:
 *       - in: path
 *         name: supplierId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       default:
 *         description: No response is ever sent (unimplemented)
 */
router.get('/supplier/:supplierId', paymentController.getPaymentsBySupplier);

/**
 * @swagger
 * /payments/purchaseOrder/{purchaseOrderId}:
 *   get:
 *     summary: "NOT IMPLEMENTED: list payments for a purchase order"
 *     tags: [Payments]
 *     description: The controller is an empty TODO stub — no response is ever sent, so this request will hang until timeout.
 *     parameters:
 *       - in: path
 *         name: purchaseOrderId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       default:
 *         description: No response is ever sent (unimplemented)
 */
router.get('/purchaseOrder/:purchaseOrderId', paymentController.getPaymentsByPurchaseOrder);

module.exports = router;
