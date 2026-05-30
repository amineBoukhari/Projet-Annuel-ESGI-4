const express = require('express');
const router = express.Router();
const { requireRole } = require('../../middlewares/role.middlewares');
const invoiceController = require('./invoice.controller');

// All invoice routes require Admin, Owner, or Manager role
// except getById which any authenticated user can view

router.post(
  '/create',
  requireRole('Admin', 'Owner', 'Manager'),
  invoiceController.createInvoice,
);

router.put(
  '/update/:id',
  requireRole('Admin', 'Owner', 'Manager'),
  invoiceController.updateInvoice,
);

router.put(
  '/validate/:id',
  requireRole('Admin', 'Owner', 'Manager'),
  invoiceController.validateInvoice,
);

router.put(
  '/cancel/:id',
  requireRole('Admin', 'Owner', 'Manager'),
  invoiceController.cancelInvoice,
);

router.put(
  '/pay/:id',
  requireRole('Admin', 'Owner', 'Manager'),
  invoiceController.payInvoice,
);

router.get(
  '/get/:id',
  invoiceController.getInvoiceById,
);

router.get(
  '/getAll',
  requireRole('Admin', 'Owner', 'Manager'),
  invoiceController.getAllInvoices,
);

router.get(
  '/getUnpaid',
  requireRole('Admin', 'Owner', 'Manager'),
  invoiceController.getUnpaidInvoices,
);

router.post(
  '/quickCreate',
  requireRole('Admin', 'Owner', 'Manager'),
  invoiceController.quickCreateInvoice,
);

module.exports = router;
