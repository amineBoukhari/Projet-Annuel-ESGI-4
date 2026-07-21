const express = require("express");
const router = express.Router();
const recipeController = require("./recipe.controller");
const { requireRole } = require("../../middlewares/role.middlewares");

/**
 * @swagger
 * /recipes/add:
 *   post:
 *     summary: Create a recipe with its ingredient list (Admin or Owner)
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ingredientId: { type: integer }
 *                     quantity: { type: number }
 *     responses:
 *       201:
 *         description: Recipe created
 *       500:
 *         description: Failed to add recipe
 */
router.post("/add", requireRole("Admin", "Owner"), recipeController.addRecipe);

/**
 * @swagger
 * /recipes/get/{id}:
 *   get:
 *     summary: Get a recipe by ID, including its ingredients and quantities
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: The recipe
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Failed to fetch recipe
 */
router.get("/get/:id", recipeController.getRecipeById);

/**
 * @swagger
 * /recipes/getAll:
 *   get:
 *     summary: List all recipes, including their ingredients and quantities
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: Array of recipes
 *       500:
 *         description: Failed to fetch recipes
 */
router.get("/getAll", recipeController.getAllRecipes);

/**
 * @swagger
 * /recipes/update/{id}:
 *   put:
 *     summary: Update a recipe, optionally replacing its ingredient list (Admin or Owner)
 *     tags: [Recipes]
 *     description: If ingredients is provided (even an empty array is falsy-safe — only checked for truthiness), all existing recipe ingredients are replaced.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ingredientId: { type: integer }
 *                     quantity: { type: number }
 *     responses:
 *       200:
 *         description: The updated recipe
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Failed to update recipe
 */
router.put(
  "/update/:id",
  requireRole("Admin", "Owner"),
  recipeController.updateRecipe,
);

/**
 * @swagger
 * /recipes/delete/{id}:
 *   delete:
 *     summary: Delete a recipe (Admin or Owner)
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Recipe deleted successfully
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Failed to delete recipe
 */
router.delete(
  "/delete/:id",
  requireRole("Admin", "Owner"),
  recipeController.deleteRecipe,
);

/**
 * @swagger
 * /recipes/cook/{id}:
 *   post:
 *     summary: Cook a recipe — deducts each ingredient's required quantity times portions from stock
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               portions: { type: integer, default: 1 }
 *     responses:
 *       200:
 *         description: Confirmation message plus the resulting stock movements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 movements: { type: array, items: { type: object } }
 *       400:
 *         description: e.g. insufficient stock for one or more ingredients (error message from the stock strategy)
 */
router.post(
  "/cook/:id",
  requireRole("Admin", "Owner", "Manager", "Employee"),
  recipeController.cookRecipe,
);

module.exports = router;
