const Role = require("./role.model");
const Permission = require("../permission/permission.model");
const RolePermission = require("./rolePermission.model");

async function getAllRoles(req, res) {
  try {
    const roles = await Role.findAll({
      include: [{ model: Permission, as: "permissions", through: { attributes: [] } }],
    });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch roles" });
  }
}

async function getRoleById(req, res) {
  try {
    const role = await Role.findByPk(req.params.id, {
      include: [{ model: Permission, as: "permissions", through: { attributes: [] } }],
    });
    if (!role) return res.status(404).json({ error: "Role not found" });
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch role" });
  }
}

async function getRoleWithPermissions(req, res) {
  try {
    const role = await Role.findByPk(req.params.id, {
      include: [{ model: Permission, as: "permissions", through: { attributes: [] } }],
    });
    if (!role) return res.status(404).json({ error: "Role not found" });
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch role with permissions" });
  }
}

async function updateRolePermissions(req, res) {
  try {
    const { permissionIds } = req.body;
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ error: "Role not found" });

    if (!Array.isArray(permissionIds)) {
      return res.status(400).json({ error: "permissionIds must be an array" });
    }

    const permissions = await Permission.findAll({ where: { id: permissionIds } });
    await role.setPermissions(permissions);

    const updated = await Role.findByPk(req.params.id, {
      include: [{ model: Permission, as: "permissions", through: { attributes: [] } }],
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update role permissions" });
  }
}

module.exports = {
  getAllRoles,
  getRoleById,
  getRoleWithPermissions,
  updateRolePermissions,
};
