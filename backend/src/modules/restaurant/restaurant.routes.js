const express = require("express");
const router = express.Router();
const { requireRole } = require("../../middlewares/role.middlewares");
const restaurantController = require("./restaurant.controller");

router.get("/getAll",        requireRole("Admin"), restaurantController.getAllRestaurants);
router.get("/get/:id",       requireRole("Admin", "Owner", "Manager"), restaurantController.getRestaurantById);
router.post("/create",       requireRole("Admin"), restaurantController.createRestaurant);
router.put("/update/:id",    requireRole("Admin", "Owner", "Manager"), restaurantController.updateRestaurant);
router.delete("/delete/:id", requireRole("Admin"), restaurantController.deleteRestaurant);

module.exports = router;
