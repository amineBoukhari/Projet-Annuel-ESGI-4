const PurchaseOrder = require('./purchaseOrder.model');
const PurchaseOrderItem = require('./purchaseOrderItem.model');

async function createPurchaseOrder(req, res) {
}

async function updatePurchaseOrder(req, res) {
}

async function deletePurchaseOrder(req, res) {
}

async function getPurchaseOrderById(req, res) {
}

async function getAllPurchaseOrders(req, res) {
}

async function updatePurchaseOrderStatus(req, res) {
}

async function receivePurchaseOrder(req, res) {
  // TODO
  // 1. Find PurchaseOrder by req.params.id
  // 2. Loop req.body.receivedItems [{ ingredientId, receivedQuantity, damagedQuantity }]
  // 3. Create a stock movement for each ingredient (receivedQuantity - damagedQuantity)
  // 4. Update PurchaseOrder status to 'Delivered'
  // 5. Optionally save a receiving record / note from req.body.note
}

module.exports = {
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrderById,
  getAllPurchaseOrders,
  updatePurchaseOrderStatus,
  receivePurchaseOrder,
};

