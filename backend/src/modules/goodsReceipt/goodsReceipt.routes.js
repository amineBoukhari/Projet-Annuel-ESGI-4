const express = require('express');
const router = express.Router();
const { requireRole } = require('../../middlewares/role.middlewares');
const goodsReceiptController = require('./goodsReceipt.controller');

router.post('/create', requireRole('Admin', 'Owner', 'Manager'), goodsReceiptController.createGoodsReceipt);
router.get('/getAll', goodsReceiptController.getAllGoodsReceipts);
router.get('/get/:id', goodsReceiptController.getGoodsReceiptById);
router.put('/update/:id', requireRole('Admin', 'Owner', 'Manager'), goodsReceiptController.updateGoodsReceipt);
router.put('/validate/:id', requireRole('Admin', 'Owner', 'Manager'), goodsReceiptController.validateGoodsReceipt);
router.delete('/delete/:id', requireRole('Admin', 'Owner'), goodsReceiptController.deleteGoodsReceipt);

module.exports = router;
