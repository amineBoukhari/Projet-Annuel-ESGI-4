const express = require("express");
const router = express.Router();
const { requireRole } = require("../../middlewares/role.middlewares");
const ingredientController = require("./ingredient.controller");

/**
 * @swagger
 * /ingredients/add:
 *   post:
 *     summary: Add an ingredient (Admin, Owner, or Manager)
 *     tags: [Ingredients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               unit: { type: string }
 *               stockQuantity: { type: number }
 *               minStockLevel: { type: number }
 *               imageUrl: { type: string }
 *               expirationDate: { type: string, format: date }
 *     responses:
 *       201:
 *         description: Ingredient created
 *       500:
 *         description: Internal server error
 */
router.post(
  "/add",
  requireRole("Admin", "Owner", "Manager"),
  ingredientController.addIngredient,
);

/**
 * @swagger
 * /ingredients/get/{id}:
 *   get:
 *     summary: Get an ingredient by ID
 *     tags: [Ingredients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: The ingredient
 *       404:
 *         description: Ingredient not found
 *       500:
 *         description: Internal server error
 */
router.get("/get/:id", ingredientController.getIngredientById);

/**
 * @swagger
 * /ingredients/getAll:
 *   get:
 *     summary: List all ingredients
 *     tags: [Ingredients]
 *     responses:
 *       200:
 *         description: Array of ingredients
 *       500:
 *         description: Internal server error
 */
router.get("/getAll", ingredientController.getAllIngredients);

/**
 * @swagger
 * /ingredients/lowStock:
 *   get:
 *     summary: List ingredients at or below their minStockLevel
 *     tags: [Ingredients]
 *     responses:
 *       200:
 *         description: Array of low-stock ingredients
 *       500:
 *         description: Internal server error
 */
router.get("/lowStock", ingredientController.getLowStock);

/**
 * @swagger
 * /ingredients/expirationDate:
 *   get:
 *     summary: "NOT WORKING: intended to list ingredients ordered by expiration date"
 *     tags: [Ingredients]
 *     description: The controller fetches the data but never calls res.json()/res.send() on the success path — the request will hang until timeout. Only the error path (500) actually responds.
 *     responses:
 *       500:
 *         description: Internal server error
 *       default:
 *         description: No response is sent on success (bug)
 */
router.get("/expirationDate", ingredientController.getIngredientByExpiration);

/**
 * @swagger
 * /ingredients/expiring-soon:
 *   get:
 *     summary: List ingredients expiring soon
 *     tags: [Ingredients]
 *     responses:
 *       200:
 *         description: Array of ingredients nearing their expiration date
 *       500:
 *         description: Internal server error
 */
router.get("/expiring-soon", ingredientController.getLowExpirationIngredients);

/**
 * @swagger
 * /ingredients/expired:
 *   get:
 *     summary: List ingredients already past their expiration date
 *     tags: [Ingredients]
 *     responses:
 *       200:
 *         description: Array of expired ingredients
 *       500:
 *         description: Internal server error
 */
router.get("/expired", ingredientController.getExpiredIngredients);

/**
 * @swagger
 * /ingredients/update/{id}:
 *   put:
 *     summary: Update an ingredient (Admin, Owner, or Manager)
 *     tags: [Ingredients]
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
 *               unit: { type: string }
 *               stockQuantity: { type: number }
 *               minStockLevel: { type: number }
 *               imageUrl: { type: string }
 *               expirationDate: { type: string, format: date }
 *     responses:
 *       200:
 *         description: The updated ingredient
 *       404:
 *         description: Ingredient not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/update/:id",
  requireRole("Admin", "Owner", "Manager"),
  ingredientController.updateIngredient,
);

/**
 * @swagger
 * /ingredients/delete/{id}:
 *   delete:
 *     summary: Delete an ingredient (Admin, Owner, or Manager)
 *     tags: [Ingredients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Ingredient deleted successfully
 *       404:
 *         description: Ingredient not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/delete/:id",
  requireRole("Admin", "Owner", "Manager"),
  ingredientController.deleteIngredient,
);

// Stock movements
/**
 * @swagger
 * /ingredients/stockMovement:
 *   post:
 *     summary: Record a stock movement for an ingredient (Admin, Owner, or Manager)
 *     tags: [Ingredients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ingredientId, quantity, reason]
 *             properties:
 *               ingredientId: { type: integer }
 *               quantity: { type: number, description: Positive or negative delta }
 *               reason: { type: string }
 *     responses:
 *       201:
 *         description: The created stock movement
 *       400:
 *         description: Missing required fields, or the movement service rejected it
 */
router.post(
  "/stockMovement",
  requireRole("Admin", "Owner", "Manager"),
  ingredientController.addStockMovementHandler,
);

/**
 * @swagger
 * /ingredients/{id}/stockMovements:
 *   get:
 *     summary: List all stock movements for an ingredient
 *     tags: [Ingredients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Array of stock movements
 *       404:
 *         description: Ingredient not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id/stockMovements", ingredientController.getStockMovements);

module.exports = router;
