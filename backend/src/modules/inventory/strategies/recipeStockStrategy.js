const StockStrategy = require('./stockStrategy');
const { addStockMovement } = require('../ingredient.service');
const Recipe = require('../Recipe.modal');
const Ingredient = require('../ingredient.model');

/**
 * RecipeStockStrategy - deducts ingredients from stock when a recipe is prepared.
 * Payload: { recipeId, portions (default: 1) }
 */
class RecipeStockStrategy extends StockStrategy {
  async execute({ recipeId, portions = 1 }) {
    if (!recipeId) {
      throw new Error('recipeId is required for RecipeStockStrategy');
    }

    const recipe = await Recipe.findByPk(recipeId, {
      include: {
        model: Ingredient,
        as: 'ingredients',
        through: { attributes: ['quantity', 'unit'] },
      },
    });

    if (!recipe) {
      throw new Error(`Recipe with id ${recipeId} not found`);
    }

    const movements = [];
    for (const ingredient of recipe.ingredients) {
      const quantityToDeduct = -(ingredient.RecipeIngredient.quantity * portions);
      const movement = await addStockMovement(
        ingredient.id,
        quantityToDeduct,
        `Used in recipe "${recipe.name}" (x${portions})`
      );
      movements.push(movement);
    }

    return movements;
  }
}

module.exports = RecipeStockStrategy;
