const express = require('express');
const router = express.Router();
const { requireRole } = require('../../middlewares/role.middlewares');
const supplierController = require('./supplier.controller');

router.post('/create', requireRole('Admin', 'Owner', 'Manager'), supplierController.createSupplier);
router.get('/getAll', supplierController.getAllSuppliers);
router.get('/get/:id', supplierController.getSupplierById);
router.put('/update/:id', requireRole('Admin', 'Owner', 'Manager'), supplierController.updateSupplier);
router.delete('/delete/:id', requireRole('Admin', 'Owner'), supplierController.deleteSupplier);

module.exports = router;
