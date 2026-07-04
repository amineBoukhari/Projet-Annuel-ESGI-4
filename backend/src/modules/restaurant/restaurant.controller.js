const Restaurant = require("./restaurant.model");
const User = require("../user/user.model");
const Role = require("../role/role.model");
const authService = require("../auth/auth.service");
const { Op } = require("sequelize");

async function getAllRestaurants(req, res) {
  try {
    const restaurants = await Restaurant.findAll({
      include: [
        {
          model: User,
          as: "users",
          attributes: { exclude: ["password"] },
          include: [{ model: Role, as: "role" }],
        },
      ],
      order: [["name", "ASC"]],
    });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
}

async function getRestaurantById(req, res) {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "users",
          attributes: { exclude: ["password"] },
          include: [{ model: Role, as: "role" }],
        },
      ],
    });
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurant" });
  }
}

async function createRestaurant(req, res) {
  const { name, adress, adminName, adminEmail, adminPassword } = req.body;

  if (!name || !adress || !adminName || !adminEmail || !adminPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existing = await Restaurant.findOne({
      where: { [Op.or]: [{ name }, { adress }] },
    });
    if (existing) return res.status(400).json({ message: "restaurant already exist" });

    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (existingAdmin) return res.status(400).json({ message: "admin with this email already exist" });

    const hashedPassword = await authService.hashPassword(adminPassword);
    const newRestaurant = await Restaurant.create({ name, adress });

    const ownerRole = await Role.findOne({ where: { name: "Owner" } });
    await User.create({
      username: adminName,
      email: adminEmail,
      password: hashedPassword,
      roleId: ownerRole.id,
      restaurantId: newRestaurant.id,
      mustChangePassword: true,
    });

    res.status(201).json({ message: "restaurant and admin created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create restaurant" });
  }
}

async function updateRestaurant(req, res) {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

    const isAdmin = req.user.role?.name === "Admin";
    if (!isAdmin) {
      if (req.user.restaurantId !== restaurant.id) {
        return res.status(403).json({ error: "Forbidden" });
      }
      // Owner/Manager may only update their own restaurant's WhatsApp number
      await restaurant.update({ whatsappNumber: req.body.whatsappNumber });
      return res.json(restaurant);
    }

    const { name, adress, whatsappNumber } = req.body;
    if (!name || !adress) return res.status(400).json({ error: "name and adress are required" });

    await restaurant.update({ name, adress, whatsappNumber });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: "Failed to update restaurant" });
  }
}

async function deleteRestaurant(req, res) {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });
    await restaurant.destroy();
    res.json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete restaurant" });
  }
}

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
