const Payment = require('./payment.model');

async function createPayment(req, res) {
  // TODO
  // Body: { supplierId, purchaseOrderId, restaurantId, amount, method, status, dueDate, reference }
}

async function getPaymentsBySupplier(req, res) {
  // TODO
  // req.params.supplierId
}

async function getPaymentsByPurchaseOrder(req, res) {
  // TODO
  // req.params.purchaseOrderId
}

module.exports = { createPayment, getPaymentsBySupplier, getPaymentsByPurchaseOrder };
