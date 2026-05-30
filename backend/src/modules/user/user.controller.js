const User = require("../user/user.model");
const authService = require("../auth/auth.service");
const Role = require("../role/role.model");
const jwt = require("jsonwebtoken");
const cookieManager = require("../../utils/cookieManager");

const ROUTE_ROLE_MAP = {
  "/createUser": 4, // default role is employee
  "/createOwner": 1,
  "/createManager": 2,
  "/createEmployee": 4,
};

const AVAILABLE_ROLES = {
  1: "Admin",
  2: "Owner",
  3: "Manager",
  4: "Employee",
};

async function createUser(req, res) {
  console.log("Creating user with data:", req.body);
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const roleId = ROUTE_ROLE_MAP[req.route.path];
  const username = req.body.username;
  const mustChangePassword =
    req.body.mustChangePassword !== undefined
      ? req.body.mustChangePassword
      : true;
  const restaurantId = req.body.restaurantId || null;
  const existingUser = await User.findOne({ where: { email: email } });
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "User with this email already exists" });
  }

  try {
    const hashedPassword = await authService.hashPassword(password);
    await User.create({
      username,
      email,
      password: hashedPassword,
      roleId: roleId,
      restaurantId: restaurantId,
      mustChangePassword: mustChangePassword,
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
}

async function getUSerWithId(req, res) {
  const userId = req.params.id;
  try {
    const user = await User.findOne({
      where: { id: userId },
      include: "role",
      attributes: {
        exclude: ["password", "roleId"],
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ error: "Error While fetching user" + error.message });
  }
}

async function getAllUsers(req, res) {
  const where = {};
  // Only Admins can see all users; Owner/Manager see only their restaurant
  if (req.user.role?.name !== "Admin") {
    where.restaurantId = req.user.restaurantId || null;
  }

  const users = await User.findAll({
    where,
    attributes: { exclude: ["password"] },
    include: "role",
  });
  if (!users || users.length === 0) {
    return res.status(200).json({ message: "no user was found" });
  }
  return res.status(200).json(users);
}

async function getMyProfile(req, res) {
  try {
    const userId = req.user.id;

    const user = await User.findOne({
      where: { id: userId },
      include: "role",
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    return res.status(500).json({ error: "Error while fetching profile" });
  }
}

async function deleteUser(req, res) {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
}

async function updateUser(req, res) {
  const userId = req.user.id;
  const { username, email } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.update({ username, email });

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Failed to update user" });
  }
}

async function updateRole(req, res) {
  const userId = req.params.id;
  let newRole = req.body.newRole;

  if (
    typeof newRole === "number" &&
    Object.keys(AVAILABLE_ROLES).includes(String(newRole))
  ) {
    // newRole is already a valid numeric ID — keep as-is
  } else if (
    typeof newRole === "string" &&
    Object.values(AVAILABLE_ROLES).some(
      (v) => v.toLowerCase() === newRole.toLowerCase(),
    )
  ) {
    newRole = parseInt(
      Object.keys(AVAILABLE_ROLES).find(
        (key) => AVAILABLE_ROLES[key].toLowerCase() === newRole.toLowerCase(),
      ),
    );
  } else {
    return res.status(400).json({ error: "Invalid role value" });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.roleId = newRole;
    await user.save();
    return res.status(200).json({
      message: "User role updated successfully to " + AVAILABLE_ROLES[newRole],
    });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ error: "Error while updating user role: " + err.message });
  }
}

module.exports = {
  createUser,
  getUSerWithId,
  getAllUsers,
  updateUser,
  deleteUser,
  updateRole,
  getMyProfile,
};
