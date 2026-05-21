const Ingredient = require("./ingredient.model");
const StockMovement = require("./stockMovement.model");

/**
 * Add a stock movement and update the ingredient's stockQuantity.
 * @param {number} ingredientId
 * @param {number} quantity - positive to add, negative to remove
 * @param {string} reason
 * @returns {Promise<StockMovement>}
 */
async function addStockMovement(ingredientId, quantity, reason) {
  const ingredient = await Ingredient.findByPk(ingredientId);
  if (!ingredient) {
    throw new Error(`Ingredient with id ${ingredientId} not found`);
  }

  const newStock = ingredient.stockQuantity + quantity;
  if (newStock < 0) {
    throw new Error(
      `Insufficient stock for ingredient "${ingredient.name}". Available: ${ingredient.stockQuantity}, Required: ${Math.abs(quantity)}`,
    );
  }

  await ingredient.update({ stockQuantity: newStock });

  const movement = await StockMovement.create({
    ingredientId,
    quantity,
    reason,
    date: new Date(),
  });

  return movement;
}

/**
 * Check if an ingredient is below its minimum stock level.
 * @param {number} ingredientId
 * @returns {Promise<boolean>}
 */
async function isLowStock(ingredientId) {
  const ingredient = await Ingredient.findByPk(ingredientId);
  if (!ingredient) {
    throw new Error(`Ingredient with id ${ingredientId} not found`);
  }
  return ingredient.stockQuantity <= ingredient.minStockLevel;
}

/**
 * Get all ingredients that are below or at their minimum stock level.
 * @returns {Promise<Ingredient[]>}
 */
async function getLowStockIngredients() {
  const ingredients = await Ingredient.findAll();
  return ingredients.filter((i) => i.stockQuantity <= i.minStockLevel);
}

module.exports = { addStockMovement, isLowStock, getLowStockIngredients };
