const PurchaseReturn = require('./purchaseReturn.model');
const PurchaseReturnItem = require('./purchaseReturnItem.model');

async function createPurchaseReturn(req, res) {
  // TODO
  // 1. Create PurchaseReturn record (supplierId, restaurantId, purchaseOrderId, notes, createdBy)
  // 2. Loop req.body.items [{ ingredientId, quantity, reason }]
  // 3. Create PurchaseReturnItem for each
  // 4. Create StockMovement for each ingredient with negative quantity, reason: "Return to Supplier"
}

module.exports = { createPurchaseReturn };
