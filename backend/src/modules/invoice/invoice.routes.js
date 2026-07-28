const express = require('express');
const router = express.Router();
const { requireRole } = require('../../middlewares/role.middlewares');
const invoiceController = require('./invoice.controller');

// All invoice routes require Admin, Owner, or Manager role
// except getById which any authenticated user can view

/**
 * @swagger
 * /invoices/create:
 *   post:
 *     summary: Create a draft invoice with line items (Admin, Owner, or Manager)
 *     tags: [Invoices]
 *     description: "Server generates the invoice number and computes totalAmount/taxAmount from items (qty × unitPrice, plus VAT). Created with status 'draft'."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customerName, items]
 *             properties:
 *               customerName: { type: string }
 *               customerEmail: { type: string, format: email }
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   properties:
 *                     description: { type: string, default: Item }
 *                     quantity: { type: integer }
 *                     unitPrice: { type: number }
 *                     recipeId: { type: integer }
 *     responses:
 *       201:
 *         description: Invoice created successfully
 *       400:
 *         description: Missing customerName, caller has no restaurant, or no line items provided
 *       500:
 *         description: Failed to create invoice
 */
router.post(
  '/create',
  requireRole('Admin', 'Owner', 'Manager'),
  invoiceController.createInvoice,
);

/**
 * @swagger
 * /invoices/update/{id}:
 *   put:
 *     summary: Update a draft invoice, optionally replacing its line items (Admin, Owner, or Manager)
 *     tags: [Invoices]
 *     description: Only allowed while status is "draft" — 400 otherwise. Providing items replaces all existing items and recalculates totals.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerName: { type: string }
 *               customerEmail: { type: string, format: email }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     description: { type: string }
 *                     quantity: { type: integer }
 *                     unitPrice: { type: number }
 *                     recipeId: { type: integer }
 *     responses:
 *       200:
 *         description: Invoice updated successfully
 *       400:
 *         description: Cannot edit invoice unless status is draft
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Failed to update invoice
 */
router.put(
  '/update/:id',
  requireRole('Admin', 'Owner', 'Manager'),
  invoiceController.updateInvoice,
);

/**
 * @swagger
 * /invoices/validate/{id}:
 *   put:
 *     summary: Validate a draft invoice, moving it to status "validated" (Admin, Owner, or Manager)
 *     tags: [Invoices]
 *     description: Only allowed while status is "draft" — 400 otherwise.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Invoice validated successfully
 *       400:
 *         description: Cannot validate invoice unless status is draft
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Failed to validate invoice
 */
router.put(
  '/validate/:id',
  requireRole('Admin', 'Owner', 'Manager'),
  invoiceController.validateInvoice,
);

/**
 * @swagger
 * /invoices/cancel/{id}:
 *   put:
 *     summary: Cancel an invoice (Admin, Owner, or Manager)
 *     tags: [Invoices]
 *     description: Only allowed while status is "draft" or "validated" — 400 if already paid or already cancelled.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Invoice cancelled successfully
 *       400:
 *         description: Cannot cancel invoice unless status is draft or validated
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Failed to cancel invoice
 */
router.put(
  '/cancel/:id',
  requireRole('Admin', 'Owner', 'Manager'),
  invoiceController.cancelInvoice,
);

/**
 * @swagger
 * /invoices/pay/{id}:
 *   put:
 *     summary: Mark a validated invoice as paid and create the corresponding Payment record (Admin, Owner, or Manager)
 *     tags: [Invoices]
 *     description: Only allowed while status is "validated" — 400 otherwise.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               method: { type: string, default: Cash }
 *     responses:
 *       200:
 *         description: Invoice marked as paid
 *       400:
 *         description: User has no restaurant, or invoice isn't in validated status
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Failed to pay invoice
 */
router.put(
  '/pay/:id',
  requireRole('Admin', 'Owner', 'Manager'),
  invoiceController.payInvoice,
);

/**
 * @swagger
 * /invoices/get/{id}:
 *   get:
 *     summary: Get an invoice by ID, including its line items
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: The invoice
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Failed to fetch invoice
 */
router.get(
  '/get/:id',
  invoiceController.getInvoiceById,
);

/**
 * @swagger
 * /invoices/getAll:
 *   get:
 *     summary: List invoices (Admin, Owner, or Manager). Admins see all, others see only their restaurant.
 *     tags: [Invoices]
 *     responses:
 *       200:
 *         description: Array of invoices with items, newest first
 *       500:
 *         description: Failed to fetch invoices
 */
router.get(
  '/getAll',
  requireRole('Admin', 'Owner', 'Manager'),
  invoiceController.getAllInvoices,
);

/**
 * @swagger
 * /invoices/getUnpaid:
 *   get:
 *     summary: List invoices with status draft or validated (Admin, Owner, or Manager)
 *     tags: [Invoices]
 *     responses:
 *       200:
 *         description: Array of unpaid invoices with items, newest first
 *       500:
 *         description: Failed to fetch unpaid invoices
 */
router.get(
  '/getUnpaid',
  requireRole('Admin', 'Owner', 'Manager'),
  invoiceController.getUnpaidInvoices,
);

/**
 * @swagger
 * /invoices/quickCreate:
 *   post:
 *     summary: Create and immediately pay a single-line counter invoice (Admin, Owner, or Manager)
 *     tags: [Invoices]
 *     description: "Creates the invoice already in status 'paid' with one line item ('Paiement comptoir') and a matching Payment record, all in one transaction. Tax is derived from totalAmount (VAT-inclusive), not added on top."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [totalAmount]
 *             properties:
 *               customerName: { type: string, description: Defaults to a configured walk-in customer name }
 *               totalAmount: { type: number, description: Must be greater than 0 }
 *               paymentMethod: { type: string, default: Cash }
 *     responses:
 *       201:
 *         description: Invoice created and paid successfully
 *       400:
 *         description: totalAmount missing/non-positive, or caller has no restaurant
 *       500:
 *         description: Failed to create quick invoice
 */
router.post(
  '/quickCreate',
  requireRole('Admin', 'Owner', 'Manager'),
  invoiceController.quickCreateInvoice,
);

module.exports = router;
