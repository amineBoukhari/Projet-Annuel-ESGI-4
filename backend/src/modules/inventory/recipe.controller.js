const Recipe = require("./Recipe.modal");
const Ingredient = require("./ingredient.model");
const RecipeIngredient = require("./RecipeIngredient.modal");
const RecipeStockStrategy = require("./strategies/recipeStockStrategy");

const addRecipe = async (req, res) => {
  try {
    const { name, description, ingredients } = req.body;

    const recipe = await Recipe.create({ name, description });

    if (ingredients && ingredients.length > 0) {
      const recipeIngredients = ingredients.map((ing) => ({
        recipeId: recipe.id,
        ingredientId: ing.ingredientId,
        quantity: ing.quantity,
      }));
      await RecipeIngredient.bulkCreate(recipeIngredients);
    }

    res.status(201).json(recipe);
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).json({ error: "Failed to add recipe" });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByPk(id, {
      include: {
        model: Ingredient,
        as: "ingredients",
        through: { attributes: ["quantity"] },
      },
    });

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
};

const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      include: {
        model: Ingredient,
        as: "ingredients",
        through: { attributes: ["quantity"] },
      },
    });
    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, ingredients } = req.body;

    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    await recipe.update({ name, description });

    if (ingredients) {
      await RecipeIngredient.destroy({ where: { recipeId: id } });
      const recipeIngredients = ingredients.map((ing) => ({
        recipeId: id,
        ingredientId: ing.ingredientId,
        quantity: ing.quantity,
      }));
      await RecipeIngredient.bulkCreate(recipeIngredients);
    }

    res.json(recipe);
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({ error: "Failed to update recipe" });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    await recipe.destroy();
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ error: "Failed to delete recipe" });
  }
};

const cookRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const portions = req.body.portions || 1;

    const strategy = new RecipeStockStrategy();
    const movements = await strategy.execute({ recipeId: id, portions });

    res.json({
      message: `Recipe cooked x${portions}. Stock updated.`,
      movements,
    });
  } catch (error) {
    console.error("Error cooking recipe:", error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addRecipe,
  getRecipeById,
  getAllRecipes,
  updateRecipe,
  deleteRecipe,
  cookRecipe,
};
