const express = require("express");
const router = express.Router();
const { requireRole } = require("../../middlewares/role.middlewares");
const restaurantController = require("./restaurant.controller");

/**
 * @swagger
 * /restaurants/getAll:
 *   get:
 *     summary: List all restaurants with their users (Admin only)
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: Array of restaurants, each including its users (passwords excluded)
 *       500:
 *         description: Failed to fetch restaurants
 */
router.get("/getAll",        requireRole("Admin"), restaurantController.getAllRestaurants);

/**
 * @swagger
 * /restaurants/get/{id}:
 *   get:
 *     summary: Get a restaurant by ID with its users (Admin, Owner, or Manager)
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: The restaurant, including its users (passwords excluded)
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Failed to fetch restaurant
 */
router.get("/get/:id",       requireRole("Admin", "Owner", "Manager"), restaurantController.getRestaurantById);

/**
 * @swagger
 * /restaurants/create:
 *   post:
 *     summary: Create a restaurant along with its Owner account (Admin only)
 *     tags: [Restaurants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, adress, adminName, adminEmail, adminPassword]
 *             properties:
 *               name: { type: string }
 *               adress: { type: string }
 *               adminName: { type: string }
 *               adminEmail: { type: string, format: email }
 *               adminPassword: { type: string, format: password }
 *     responses:
 *       201:
 *         description: Restaurant and admin created successfully
 *       400:
 *         description: Missing fields, restaurant already exists, or admin email already exists
 *       500:
 *         description: Failed to create restaurant
 */
router.post("/create",       requireRole("Admin"), restaurantController.createRestaurant);

/**
 * @swagger
 * /restaurants/update/{id}:
 *   put:
 *     summary: Update a restaurant (Admin, Owner, or Manager)
 *     tags: [Restaurants]
 *     description: >
 *       Admins can update name/adress/whatsappNumber on any restaurant. Owner/Manager can only
 *       update whatsappNumber, and only on their own restaurant (403 otherwise).
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
 *               name: { type: string, description: Admin only }
 *               adress: { type: string, description: Admin only }
 *               whatsappNumber: { type: string }
 *     responses:
 *       200:
 *         description: The updated restaurant
 *       400:
 *         description: "name and adress are required (Admin path)"
 *       403:
 *         description: Forbidden — Owner/Manager attempting to update another restaurant
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Failed to update restaurant
 */
router.put("/update/:id",    requireRole("Admin", "Owner", "Manager"), restaurantController.updateRestaurant);

/**
 * @swagger
 * /restaurants/delete/{id}:
 *   delete:
 *     summary: Delete a restaurant (Admin only)
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Failed to delete restaurant
 */
router.delete("/delete/:id", requireRole("Admin"), restaurantController.deleteRestaurant);

module.exports = router;
