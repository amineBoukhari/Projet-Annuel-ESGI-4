const Restaurant = require("./restaurant.model");
const { createUser } = require("../user/user.controller");
const { Op } = require("sequelize");
const authService = require("../auth/auth.service");
const User = require("../user/user.model");
const Role = require("../role/role.model");

async function createRestaurant(req, res) {
  console.log("Creating restaurant with data:", req.body);
  const { name, adress, adminName, adminEmail, adminPassword } = req.body;

  if (!name || !adress || !adminName || !adminEmail || !adminPassword) {
    res.status(500).json({ message: "internals server error" });
  }
  const restaurant = await Restaurant.findOne({
    where: {
      [Op.or]: [{ name: name }, { adress: adress }],
    },
  });

  const admin = await User.findOne({ where: { email: adminEmail } });

  if (admin) {
    console.log("Admin with email already exists:", adminEmail);
    return res
      .status(400)
      .json({ message: "admin with this email already exist" });
  }

  if (restaurant) {
    console.log(
      "Restaurant with name or address already exists:",
      name,
      adress,
    );
    return res.status(400).json({ message: "restaurant already exist" });
  }

  try {
    const hashedPassword = await authService.hashPassword(adminPassword);
    const newRestaurant = await Restaurant.create({
      name: name,
      adress: adress,
    });
    const adminRole = await Role.findOne({ where: { name: "Admin" } });
    const newAdmin = await User.create({
      username: adminName,
      email: adminEmail,
      password: hashedPassword,
      roleId: adminRole.id,
      restaurantId: newRestaurant.id,
    });
    res
      .status(201)
      .json({ message: "restaurant and admin created successfully" });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({ error: "Failed to create restaurant" });
  }
}

module.exports = {
  createRestaurant,
};
