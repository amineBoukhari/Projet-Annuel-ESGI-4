const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function comparePasswords(password, userPassword) {
  return await bcrypt.compare(password, userPassword);
}

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function generateToken(user) {
  let role = null;
  let permissions = [];

  if (user.role && user.role.name) {
    role = { name: user.role.name };
    if (user.role.permissions) {
      permissions = user.role.permissions.map((p) => p.name);
    }
  } else {
    // Fetch role and permissions from DB if not already present
    const User = require("../user/user.model");
    const Role = require("../role/role.model");
    const Permission = require("../permission/permission.model");
    const fullUser = await User.findByPk(user.id, {
      include: [
        {
          model: Role,
          as: "role",
          include: [{ model: Permission, as: "permissions" }],
        },
      ],
    });
    if (fullUser && fullUser.role) {
      role = { name: fullUser.role.name };
      permissions = fullUser.role.permissions
        ? fullUser.role.permissions.map((p) => p.name)
        : [];
    }
  }

  const payload = {
    id: user.id,
    email: user.email,
    mustChangePassword: user.mustChangePassword,
    restaurantId: user.restaurantId,
    role,
    permissions,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
}

function extractRole(token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.role;
}

function extractPermissions(token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.permissions;
}

module.exports = {
  comparePasswords,
  hashPassword,
  generateToken,
  extractRole,
  extractPermissions,
};
