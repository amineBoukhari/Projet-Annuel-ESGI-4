const express = require('express');
const router = express.Router();
const { requireRole } = require('../../middlewares/role.middlewares');
const purchaseOrderController = require('./purchaseOrder.controller');

router.post('/create', requireRole('Admin', 'Owner', 'Manager'), purchaseOrderController.createPurchaseOrder);
router.get('/getAll', purchaseOrderController.getAllPurchaseOrders);
router.get('/get/:id', purchaseOrderController.getPurchaseOrderById);
router.put('/update/:id', requireRole('Admin', 'Owner', 'Manager'), purchaseOrderController.updatePurchaseOrder);
router.put('/updateStatus/:id', requireRole('Admin', 'Owner', 'Manager'), purchaseOrderController.updatePurchaseOrderStatus);
router.post('/receive/:id', requireRole('Admin', 'Owner', 'Manager'), purchaseOrderController.receivePurchaseOrder);
router.delete('/delete/:id', requireRole('Admin', 'Owner'), purchaseOrderController.deletePurchaseOrder);

module.exports = router;
