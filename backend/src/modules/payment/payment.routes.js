const express = require('express');
const router = express.Router();
const { requireRole } = require('../../middlewares/role.middlewares');
const paymentController = require('./payment.controller');

router.post('/create', requireRole('Admin', 'Owner', 'Manager'), paymentController.createPayment);
router.get('/supplier/:supplierId', paymentController.getPaymentsBySupplier);
router.get('/purchaseOrder/:purchaseOrderId', paymentController.getPaymentsByPurchaseOrder);

module.exports = router;
