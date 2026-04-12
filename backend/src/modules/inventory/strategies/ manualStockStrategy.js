const StockStrategy = require('./stockStrategy');
const { addStockMovement } = require('../ingredient.service');

/**
 * ManualStockStrategy - handles manual stock adjustments made by staff.
 * Payload: { ingredientId, quantity (positive=add, negative=remove), reason }
 */
class ManualStockStrategy extends StockStrategy {
  async execute({ ingredientId, quantity, reason = 'Manual adjustment' }) {
    if (!ingredientId || quantity === undefined) {
      throw new Error('ingredientId and quantity are required for ManualStockStrategy');
    }
    return addStockMovement(ingredientId, quantity, reason);
  }
}

module.exports = ManualStockStrategy;
