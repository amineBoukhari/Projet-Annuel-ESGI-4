const Invoice = require('./invoice.model');
const InvoiceItem = require('./invoiceItem.model');
const Payment = require('./payment.model');


async function createInvoice(req, res) {


}
async function updateInvoice(req, res) {

}

async function cancelInvoice(req, res) {

}

async function getInvoices(req, res) {
  
  res.status(501).json({ message: 'getInvoices — not implemented' });
}


async function getInvoiceById(req, res) {


}

async function getInvoicePdf(req, res) {

}


async function addPayment(req, res) {

}

async function getUnpaidInvoices(req, res) {

}

module.exports = {
  createInvoice,
  updateInvoice,
  cancelInvoice,
  getInvoices,
  getInvoiceById,
  getInvoicePdf,
  addPayment,
  getUnpaidInvoices,
};
