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

/**
 * Check if an ingredient is below it's maximum expiration date.
 * @param {number} ingredientId
 * @returns {Promise<Boolean>}
 */


/**
 * Get all ingredients that expire within the next 7 days or are already expired.
 * @returns {Promise<Ingredient[]>}
 */
async function getLowExpirationDate() {
  const ingredients = await Ingredient.findAll();
  const today = new Date();
  const in7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  return ingredients.filter((i) => {
    if (!i.expirationDate) return false;
    const expDate = new Date(i.expirationDate);
    return expDate <= in7Days && expDate >= today;
  });
}

/**
 * Get all expired ingredients.
 * @returns {Promise<Ingredient[]>}
 */
async function getExpiredIngredients() {
  const ingredients = await Ingredient.findAll();
  const today = new Date();
  
  return ingredients.filter((i) => {
    if (!i.expirationDate) return false;
    const expDate = new Date(i.expirationDate);
    return expDate < today;
  });
}

module.exports = { addStockMovement, isLowStock, getLowStockIngredients, getLowExpirationDate, getExpiredIngredients };
