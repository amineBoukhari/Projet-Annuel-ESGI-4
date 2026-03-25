const Role = require('./role.model');
const Permission = require('../permission/permission.model');

async function createRole(req, res) {
	try {
		const { name } = req.body;
		const [role, created] = await Role.findOrCreate({ where: { name }, defaults: { name } });
		return res.status(created ? 201 : 200).json(role);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Failed to create role' });
	}
}

async function getRoles(req, res) {
	try {
		const roles = await Role.findAll();
		return res.json(roles);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Failed to fetch roles' });
	}
}

async function getRoleById(req, res) {
	try {
		const role = await Role.findByPk(req.params.id);
		if (!role) return res.status(404).json({ error: 'Role not found' });
		return res.json(role);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Failed to fetch role' });
	}
}

async function updateRole(req, res) {
	try {
		const role = await Role.findByPk(req.params.id);
		if (!role) return res.status(404).json({ error: 'Role not found' });
		await role.update(req.body);
		return res.json(role);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Failed to update role' });
	}
}

async function deleteRole(req, res) {
	try {
		const role = await Role.findByPk(req.params.id);
		if (!role) return res.status(404).json({ error: 'Role not found' });
		await role.destroy();
		return res.json({ message: 'Role deleted' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Failed to delete role' });
	}
}

async function assignPermissions(req, res) {
	try {
		const role = await Role.findByPk(req.params.id);
		if (!role) return res.status(404).json({ error: 'Role not found' });

		const { permissionIds } = req.body;
		if (!Array.isArray(permissionIds)) return res.status(400).json({ error: 'permissionIds must be an array' });

		const permissions = await Permission.findAll({ where: { id: permissionIds } });
		await role.setPermissions(permissions);
		return res.json({ message: 'Permissions assigned' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Failed to assign permissions' });
	}
}

module.exports = { createRole, getRoles, getRoleById, updateRole, deleteRole, assignPermissions };
