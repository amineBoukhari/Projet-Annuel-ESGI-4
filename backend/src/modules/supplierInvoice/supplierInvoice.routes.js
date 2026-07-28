const express = require('express');
const router = express.Router();
const { requireRole } = require('../../middlewares/role.middlewares');
const supplierInvoiceController = require('./supplierInvoice.controller');

/**
 * @swagger
 * /supplierInvoices/create:
 *   post:
 *     summary: Create a supplier invoice, optionally linked to a goods receipt/PO (Admin, Owner, or Manager)
 *     tags: [Supplier Invoices]
 *     description: subtotal/tax/total are computed server-side from items (quantity × unitPrice per line, 20% VAT). Created with status "draft".
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               goodsReceiptId: { type: integer }
 *               purchaseOrderId: { type: integer }
 *               supplierId: { type: integer }
 *               restaurantId: { type: integer }
 *               invoiceNumber: { type: string }
 *               invoiceDate: { type: string, format: date, description: Defaults to now }
 *               dueDate: { type: string, format: date }
 *               notes: { type: string }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ingredientId: { type: integer }
 *                     description: { type: string }
 *                     quantity: { type: number }
 *                     unitPrice: { type: number }
 *     responses:
 *       201:
 *         description: Supplier invoice created
 *       500:
 *         description: Failed to create supplier invoice
 */
router.post('/create', requireRole('Admin', 'Owner', 'Manager'), supplierInvoiceController.createSupplierInvoice);

/**
 * @swagger
 * /supplierInvoices/getAll:
 *   get:
 *     summary: List supplier invoices (newest invoiceDate first)
 *     tags: [Supplier Invoices]
 *     description: Non-admins are always restricted to their own restaurant, regardless of the restaurantId query param.
 *     parameters:
 *       - in: query
 *         name: restaurantId
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Array of supplier invoices with items and linked goods receipt
 *       500:
 *         description: Failed to fetch supplier invoices
 */
router.get('/getAll', supplierInvoiceController.getAllSupplierInvoices);

/**
 * @swagger
 * /supplierInvoices/get/{id}:
 *   get:
 *     summary: Get a supplier invoice by ID, including items and the full linked goods receipt
 *     tags: [Supplier Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: The supplier invoice
 *       404:
 *         description: Supplier invoice not found
 *       500:
 *         description: Failed to fetch supplier invoice
 */
router.get('/get/:id', supplierInvoiceController.getSupplierInvoiceById);

/**
 * @swagger
 * /supplierInvoices/update/{id}:
 *   put:
 *     summary: Update a supplier invoice, optionally replacing its items (Admin, Owner, or Manager)
 *     tags: [Supplier Invoices]
 *     description: Providing items replaces all existing items and recalculates subtotal/tax/total (20% VAT). Other fields are a partial update.
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
 *               invoiceNumber: { type: string }
 *               invoiceDate: { type: string, format: date }
 *               dueDate: { type: string, format: date }
 *               notes: { type: string }
 *               status: { type: string }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ingredientId: { type: integer }
 *                     description: { type: string }
 *                     quantity: { type: number }
 *                     unitPrice: { type: number }
 *     responses:
 *       200:
 *         description: The updated supplier invoice
 *       404:
 *         description: Supplier invoice not found
 *       500:
 *         description: Failed to update supplier invoice
 */
router.put('/update/:id', requireRole('Admin', 'Owner', 'Manager'), supplierInvoiceController.updateSupplierInvoice);

/**
 * @swagger
 * /supplierInvoices/delete/{id}:
 *   delete:
 *     summary: Delete a supplier invoice (Admin or Owner)
 *     tags: [Supplier Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Supplier invoice deleted successfully
 *       404:
 *         description: Supplier invoice not found
 *       500:
 *         description: Failed to delete supplier invoice
 */
router.delete('/delete/:id', requireRole('Admin', 'Owner'), supplierInvoiceController.deleteSupplierInvoice);

module.exports = router;
