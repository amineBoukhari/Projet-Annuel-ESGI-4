const { Op } = require('sequelize');
const sequelize = require('../../db/index');
const Invoice = require('./invoice.model');
const InvoiceItem = require('./invoiceItem.model');
const Payment = require('../payment/payment.model');
const APP_CONFIG = require('../../config/app.config');


async function generateInvoiceNumber() {
  const year = new Date().getFullYear();
  const prefix = `${APP_CONFIG.INVOICE_PREFIX}-${year}-`;


  const lastInvoice = await Invoice.findOne({
    where: {
      invoiceNumber: {
        [Op.like]: `${prefix}%`,
      },
    },
    order: [['invoiceNumber', 'DESC']],
  });

  let nextNumber = APP_CONFIG.INVOICE_START_NUMBER;

  if (lastInvoice) {
    const parts = lastInvoice.invoiceNumber.split('-');
    const lastNumber = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }


  const paddedNumber = String(nextNumber).padStart(4, '0');

  return `${prefix}${paddedNumber}`;
}

function calculateTotals(items) {
  let subtotal = 0;

  for (const item of items) {
    const qty = parseInt(item.quantity, 10) || 0;
    const price = parseFloat(item.unitPrice) || 0;
    const lineTotal = qty * price;
    subtotal += lineTotal;
  }

  const tax = subtotal * APP_CONFIG.VAT_RATE;
  const total = subtotal + tax;

  return {
    totalAmount: Math.round(total * 100) / 100,
    taxAmount: Math.round(tax * 100) / 100,
  };
}


function buildLineItems(items, invoiceId) {
  return items.map((item) => {
    const qty = parseInt(item.quantity, 10) || 1;
    const price = parseFloat(item.unitPrice) || 0;
    return {
      invoiceId: invoiceId,
      description: item.description || 'Item',
      quantity: qty,
      unitPrice: Math.round(price * 100) / 100,
      totalPrice: Math.round(qty * price * 100) / 100,
      recipeId: item.recipeId || null,
    };
  });
}


async function createInvoice(req, res) {
  try {
    const { customerName, customerEmail, items } = req.body;
    const userId = req.user.id;
    const restaurantId = req.user.restaurantId;

    if (!customerName) {
      return res.status(400).json({ error: 'Customer name is required' });
    }

    if (!restaurantId) {
      return res.status(400).json({ error: 'User is not associated with a restaurant' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'At least one line item is required' });
    }

    const invoiceNumber = await generateInvoiceNumber();

    const { totalAmount, taxAmount } = calculateTotals(items);

    const result = await sequelize.transaction(async (t) => {
      const invoice = await Invoice.create({
        invoiceNumber,
        restaurantId,
        customerName,
        customerEmail: customerEmail || null,
        totalAmount,
        taxAmount,
        status: 'draft',
        createdBy: userId,
      }, { transaction: t });

      const lineItems = buildLineItems(items, invoice.id);
      await InvoiceItem.bulkCreate(lineItems, { transaction: t });

      return invoice;
    });

    const createdInvoice = await Invoice.findByPk(result.id, {
      include: [{ model: InvoiceItem, as: 'items' }],
    });

    return res.status(201).json({
      message: 'Invoice created successfully',
      invoice: createdInvoice,
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return res.status(500).json({ error: 'Failed to create invoice' });
  }
}


async function updateInvoice(req, res) {
  try {
    const invoiceId = req.params.id;
    const { customerName, customerEmail, items } = req.body;

    const invoice = await Invoice.findByPk(invoiceId, {
      include: [{ model: InvoiceItem, as: 'items' }],
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }


    if (invoice.status !== 'draft') {
      return res.status(400).json({
        error: `Cannot edit invoice with status: ${invoice.status}. Only drafts can be edited.`,
      });
    }


    if (customerName) invoice.customerName = customerName;
    if (customerEmail !== undefined) invoice.customerEmail = customerEmail;


    if (items && Array.isArray(items) && items.length > 0) {

      await InvoiceItem.destroy({ where: { invoiceId: invoice.id } });

     
      const lineItems = buildLineItems(items, invoice.id);
      await InvoiceItem.bulkCreate(lineItems);


      const { totalAmount, taxAmount } = calculateTotals(items);
      invoice.totalAmount = totalAmount;
      invoice.taxAmount = taxAmount;
    }

    await invoice.save();


    const updatedInvoice = await Invoice.findByPk(invoice.id, {
      include: [{ model: InvoiceItem, as: 'items' }],
    });

    return res.status(200).json({
      message: 'Invoice updated successfully',
      invoice: updatedInvoice,
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return res.status(500).json({ error: 'Failed to update invoice' });
  }
}


async function validateInvoice(req, res) {
  try {
    const invoiceId = req.params.id;
    const invoice = await Invoice.findByPk(invoiceId);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    if (invoice.status !== 'draft') {
      return res.status(400).json({
        error: `Cannot validate invoice with status: ${invoice.status}`,
      });
    }

    invoice.status = 'validated';
    invoice.validatedAt = new Date();
    await invoice.save();

    return res.status(200).json({
      message: 'Invoice validated successfully',
      invoice,
    });
  } catch (error) {
    console.error('Error validating invoice:', error);
    return res.status(500).json({ error: 'Failed to validate invoice' });
  }
}


async function cancelInvoice(req, res) {
  try {
    const invoiceId = req.params.id;
    const invoice = await Invoice.findByPk(invoiceId);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }


    if (invoice.status !== 'draft' && invoice.status !== 'validated') {
      return res.status(400).json({
        error: `Cannot cancel invoice with status: ${invoice.status}`,
      });
    }

    invoice.status = 'cancelled';
    await invoice.save();

    return res.status(200).json({
      message: 'Invoice cancelled successfully',
      invoice,
    });
  } catch (error) {
    console.error('Error cancelling invoice:', error);
    return res.status(500).json({ error: 'Failed to cancel invoice' });
  }
}

async function payInvoice(req, res) {
  try {
    const invoiceId = req.params.id;
    const { method } = req.body;
    const userId = req.user.id;
    const restaurantId = req.user.restaurantId;

    if (!restaurantId) {
      return res.status(400).json({ error: 'User is not associated with a restaurant' });
    }

    const invoice = await Invoice.findByPk(invoiceId);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    if (invoice.status !== 'validated') {
      return res.status(400).json({
        error: `Cannot pay invoice with status: ${invoice.status}. Only validated invoices can be paid.`,
      });
    }


    invoice.status = 'paid';
    invoice.paidAt = new Date();
    await invoice.save();


    const paymentMethod = method || 'Cash';
    await Payment.create({
      restaurantId,
      amount: parseFloat(invoice.totalAmount),
      method: paymentMethod,
      status: 'Paid',
      reference: `Payment for ${invoice.invoiceNumber}`,

    });

    return res.status(200).json({
      message: 'Invoice marked as paid',
      invoice,
    });
  } catch (error) {
    console.error('Error paying invoice:', error);
    return res.status(500).json({ error: 'Failed to pay invoice' });
  }
}


async function getInvoiceById(req, res) {
  try {
    const invoiceId = req.params.id;

    const invoice = await Invoice.findByPk(invoiceId, {
      include: [{ model: InvoiceItem, as: 'items' }],
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    return res.status(200).json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return res.status(500).json({ error: 'Failed to fetch invoice' });
  }
}


async function getAllInvoices(req, res) {
  try {
    const where = {};


    if (req.user.role?.name !== 'Admin') {
      where.restaurantId = req.user.restaurantId || null;
    }

    const invoices = await Invoice.findAll({
      where,
      include: [{ model: InvoiceItem, as: 'items' }],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return res.status(500).json({ error: 'Failed to fetch invoices' });
  }
}

async function getUnpaidInvoices(req, res) {
  try {
    const where = {
      status: ['draft', 'validated'],
    };

    if (req.user.role?.name !== 'Admin') {
      where.restaurantId = req.user.restaurantId || null;
    }

    const invoices = await Invoice.findAll({
      where,
      include: [{ model: InvoiceItem, as: 'items' }],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching unpaid invoices:', error);
    return res.status(500).json({ error: 'Failed to fetch unpaid invoices' });
  }
}


async function quickCreateInvoice(req, res) {
  try {
    const { customerName, totalAmount, paymentMethod } = req.body;
    const userId = req.user.id;
    const restaurantId = req.user.restaurantId;

    if (!totalAmount || parseFloat(totalAmount) <= 0) {
      return res.status(400).json({ error: 'Total amount is required and must be greater than 0' });
    }

    if (!restaurantId) {
      return res.status(400).json({ error: 'User is not associated with a restaurant' });
    }

    const amount = parseFloat(totalAmount);
    const tax = Math.round(amount * APP_CONFIG.VAT_RATE * 100) / 100;
    const subtotal = Math.round((amount - tax) * 100) / 100;


    const invoiceNumber = await generateInvoiceNumber();

    const result = await sequelize.transaction(async (t) => {
      const invoice = await Invoice.create({
        invoiceNumber,
        restaurantId,
        customerName: customerName || APP_CONFIG.QUICK_INVOICE_CUSTOMER_NAME,
        customerEmail: null,
        totalAmount: amount,
        taxAmount: tax,
        status: 'paid',
        createdBy: userId,
        validatedAt: new Date(),
        paidAt: new Date(),
      }, { transaction: t });

      await InvoiceItem.create({
        invoiceId: invoice.id,
        description: 'Paiement comptoir',
        quantity: 1,
        unitPrice: subtotal,
        totalPrice: subtotal,
        recipeId: null,
      }, { transaction: t });

      const method = paymentMethod || 'Cash';
      await Payment.create({
        restaurantId,
        amount: amount,
        method: method,
        status: 'Paid',
        reference: `Quick payment for ${invoice.invoiceNumber}`,
      }, { transaction: t });

      return invoice;
    });

    const createdInvoice = await Invoice.findByPk(result.id, {
      include: [{ model: InvoiceItem, as: 'items' }],
    });

    return res.status(201).json({
      message: 'Invoice created and paid successfully',
      invoice: createdInvoice,
    });
  } catch (error) {
    console.error('Error quick creating invoice:', error);
    return res.status(500).json({ error: 'Failed to create quick invoice' });
  }
}

module.exports = {
  createInvoice,
  updateInvoice,
  validateInvoice,
  cancelInvoice,
  payInvoice,
  getInvoiceById,
  getAllInvoices,
  getUnpaidInvoices,
  quickCreateInvoice,
};
