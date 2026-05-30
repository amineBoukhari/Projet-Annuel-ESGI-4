const express = require('express');
const router = express.Router();
const { requireRole } = require('../../middlewares/role.middlewares');
const supplierInvoiceController = require('./supplierInvoice.controller');

router.post('/create', requireRole('Admin', 'Owner', 'Manager'), supplierInvoiceController.createSupplierInvoice);
router.get('/getAll', supplierInvoiceController.getAllSupplierInvoices);
router.get('/get/:id', supplierInvoiceController.getSupplierInvoiceById);
router.put('/update/:id', requireRole('Admin', 'Owner', 'Manager'), supplierInvoiceController.updateSupplierInvoice);
router.delete('/delete/:id', requireRole('Admin', 'Owner'), supplierInvoiceController.deleteSupplierInvoice);

module.exports = router;
