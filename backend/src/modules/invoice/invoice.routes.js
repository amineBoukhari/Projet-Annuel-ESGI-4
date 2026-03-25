const router = require('express').Router();
const invoiceController = require('./invoice.controller');


router.post('/', invoiceController.createInvoice);
router.get('/', invoiceController.getInvoices);
router.get('/unpaid', invoiceController.getUnpaidInvoices);
router.get('/:id', invoiceController.getInvoiceById);
router.put('/:id', invoiceController.updateInvoice);
router.post('/:id/cancel', invoiceController.cancelInvoice);
router.get('/:id/pdf', invoiceController.getInvoicePdf);
router.post('/:id/payments', invoiceController.addPayment);

module.exports = router;
