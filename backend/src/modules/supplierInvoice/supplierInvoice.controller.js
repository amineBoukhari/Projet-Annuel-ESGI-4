const SupplierInvoice = require('./supplierInvoice.model');
const SupplierInvoiceItem = require('./supplierInvoiceItem.model');
const GoodsReceipt = require('../goodsReceipt/goodsReceipt.model');
const GoodsReceiptItem = require('../goodsReceipt/goodsReceiptItem.model');
const Ingredient = require('../inventory/ingredient.model');

async function createSupplierInvoice(req, res) {
  try {
    const {
      goodsReceiptId,
      purchaseOrderId,
      supplierId,
      restaurantId,
      invoiceNumber,
      invoiceDate,
      dueDate,
      notes,
      items,
    } = req.body;

    // Calculate totals
    let subtotal = 0;
    const invoiceItems = (items || []).map((item) => {
      const total = item.quantity * item.unitPrice;
      subtotal += total;
      return {
        ingredientId: item.ingredientId || null,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total,
      };
    });

    const tax = subtotal * 0.20; // 20% VAT
    const total = subtotal + tax;

    const invoice = await SupplierInvoice.create({
      goodsReceiptId: goodsReceiptId || null,
      purchaseOrderId: purchaseOrderId || null,
      supplierId,
      restaurantId,
      invoiceNumber: invoiceNumber || null,
      invoiceDate: invoiceDate || new Date(),
      dueDate: dueDate || null,
      notes: notes || null,
      subtotal,
      tax,
      total,
      createdBy: req.user.id,
      status: 'draft',
    });

    if (invoiceItems.length > 0) {
      await SupplierInvoiceItem.bulkCreate(
        invoiceItems.map((item) => ({ ...item, supplierInvoiceId: invoice.id }))
      );
    }

    const fullInvoice = await SupplierInvoice.findByPk(invoice.id, {
      include: [
        { model: SupplierInvoiceItem, as: 'items', include: [{ model: Ingredient, as: 'ingredient' }] },
        { model: GoodsReceipt, as: 'goodsReceipt' },
      ],
    });

    res.status(201).json(fullInvoice);
  } catch (error) {
    console.error('Error creating supplier invoice:', error);
    res.status(500).json({ error: 'Failed to create supplier invoice' });
  }
}

async function getAllSupplierInvoices(req, res) {
  try {
    const { restaurantId } = req.query;
    const where = {};

    if (restaurantId) {
      where.restaurantId = restaurantId;
    } else if (req.user.role?.name !== 'Admin') {
      where.restaurantId = req.user.restaurantId;
    }

    const invoices = await SupplierInvoice.findAll({
      where,
      include: [
        { model: SupplierInvoiceItem, as: 'items' },
        { model: GoodsReceipt, as: 'goodsReceipt' },
      ],
      order: [['invoiceDate', 'DESC']],
    });

    res.json(invoices);
  } catch (error) {
    console.error('Error fetching supplier invoices:', error);
    res.status(500).json({ error: 'Failed to fetch supplier invoices' });
  }
}

async function getSupplierInvoiceById(req, res) {
  try {
    const invoiceId = req.params.id;
    const invoice = await SupplierInvoice.findByPk(invoiceId, {
      include: [
        { model: SupplierInvoiceItem, as: 'items', include: [{ model: Ingredient, as: 'ingredient' }] },
        { model: GoodsReceipt, as: 'goodsReceipt', include: [{ model: GoodsReceiptItem, as: 'items' }] },
      ],
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Supplier invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    console.error('Error fetching supplier invoice:', error);
    res.status(500).json({ error: 'Failed to fetch supplier invoice' });
  }
}

async function updateSupplierInvoice(req, res) {
  try {
    const invoiceId = req.params.id;
    const { invoiceNumber, invoiceDate, dueDate, notes, status, items } = req.body;

    const invoice = await SupplierInvoice.findByPk(invoiceId);
    if (!invoice) {
      return res.status(404).json({ error: 'Supplier invoice not found' });
    }

    if (items && items.length > 0) {
      await SupplierInvoiceItem.destroy({ where: { supplierInvoiceId: invoiceId } });
      let subtotal = 0;
      const newItems = items.map((item) => {
        const total = item.quantity * item.unitPrice;
        subtotal += total;
        return {
          supplierInvoiceId: invoiceId,
          ingredientId: item.ingredientId || null,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total,
        };
      });
      await SupplierInvoiceItem.bulkCreate(newItems);
      invoice.subtotal = subtotal;
      invoice.tax = subtotal * 0.20;
      invoice.total = subtotal + invoice.tax;
    }

    invoice.invoiceNumber = invoiceNumber || invoice.invoiceNumber;
    invoice.invoiceDate = invoiceDate || invoice.invoiceDate;
    invoice.dueDate = dueDate || invoice.dueDate;
    invoice.notes = notes !== undefined ? notes : invoice.notes;
    invoice.status = status || invoice.status;

    await invoice.save();

    const fullInvoice = await SupplierInvoice.findByPk(invoiceId, {
      include: [
        { model: SupplierInvoiceItem, as: 'items', include: [{ model: Ingredient, as: 'ingredient' }] },
        { model: GoodsReceipt, as: 'goodsReceipt' },
      ],
    });

    res.json(fullInvoice);
  } catch (error) {
    console.error('Error updating supplier invoice:', error);
    res.status(500).json({ error: 'Failed to update supplier invoice' });
  }
}

async function deleteSupplierInvoice(req, res) {
  try {
    const invoiceId = req.params.id;
    const invoice = await SupplierInvoice.findByPk(invoiceId);
    if (!invoice) {
      return res.status(404).json({ error: 'Supplier invoice not found' });
    }

    await invoice.destroy();
    res.json({ message: 'Supplier invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier invoice:', error);
    res.status(500).json({ error: 'Failed to delete supplier invoice' });
  }
}

module.exports = {
  createSupplierInvoice,
  getAllSupplierInvoices,
  getSupplierInvoiceById,
  updateSupplierInvoice,
  deleteSupplierInvoice,
};
