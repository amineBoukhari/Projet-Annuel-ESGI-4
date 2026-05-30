const express = require('express');
const router = express.Router();
const { requireRole } = require('../../middlewares/role.middlewares');
const purchaseReturnController = require('./purchaseReturn.controller');

router.post('/create', requireRole('Admin', 'Owner', 'Manager'), purchaseReturnController.createPurchaseReturn);

module.exports = router;
