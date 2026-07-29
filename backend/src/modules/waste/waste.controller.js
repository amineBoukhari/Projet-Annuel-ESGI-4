const { addStockMovement } = require('../inventory/ingredient.service');
const RecipeStockStrategy = require('../inventory/strategies/recipeStockStrategy');
const Expense = require('../expense/expense.model');
const Ingredient = require('../inventory/ingredient.model');
const Recipe = require('../inventory/Recipe.modal');
const sequelize = require('../../db/index');

async function addWaste(req, res) {
  try {
    const { items } = req.body;
    const userId = req.user.id;
    const restaurantId = req.user.restaurantId;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items array is required and must not be empty' });
    }

    const results = [];
    let totalCost = 0;

    await sequelize.transaction(async (transaction) => {
      for (const item of items) {
        const { type, ingredientId, recipeId, quantity, portions, reason, cost } = item;

        if (!type || !reason) {
          throw new Error(`Each item must have a type and reason`);
        }

        let description;

        if (type === 'ingredient') {
          if (!ingredientId || quantity == null) {
            throw new Error(`ingredientId and quantity are required for ingredient waste`);
          }

          const ingredient = await Ingredient.findByPk(ingredientId, { transaction });
          if (!ingredient) {
            throw new Error(`Ingredient with id ${ingredientId} not found`);
          }

          await addStockMovement(
            ingredientId,
            -Math.abs(quantity),
            `Perte: ${reason}`,
          );
          description = `Perte: ${ingredient.name} (x${quantity} ${ingredient.unit}) - ${reason}`;
        } else if (type === 'recipe') {
          if (!recipeId) {
            throw new Error(`recipeId is required for recipe waste`);
          }

          const strategy = new RecipeStockStrategy();
          await strategy.execute({
            recipeId,
            portions: portions || 1,
          });

          const recipe = await Recipe.findByPk(recipeId, { transaction });
          description = `Perte: ${recipe?.name || `Recette #${recipeId}`} (x${portions || 1}) - ${reason}`;
        } else {
          throw new Error(`Type must be "ingredient" or "recipe", got "${type}"`);
        }

        const expenseAmount = cost != null ? Math.abs(parseFloat(cost)) : 0;
        if (expenseAmount > 0) {
          await Expense.create({
            restaurantId,
            category: 'waste',
            description,
            amount: expenseAmount.toFixed(2),
            expenseDate: new Date(),
            createdBy: userId,
          }, { transaction });
          totalCost += expenseAmount;
        }

        results.push({ type, description, cost: expenseAmount });
      }
    });

    return res.status(201).json({
      message: `${results.length} perte(s) enregistrée(s) avec succès`,
      items: results,
      totalCost,
    });
  } catch (error) {
    console.error('Error recording waste:', error);
    return res.status(500).json({ error: error.message || 'Failed to record waste' });
  }
}

module.exports = { addWaste };
