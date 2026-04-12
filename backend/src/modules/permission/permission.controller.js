const Permission = require('./permission.model');

async function getAllPermissions(req, res) {
  try {
    const permissions = await Permission.findAll();
    res.json(permissions);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ error: 'Failed to fetch permissions' });
  }
}

async function getPermissionById(req, res) {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) {
      return res.status(404).json({ error: 'Permission not found' });
    }
    res.json(permission);
  } catch (error) {
    console.error('Error fetching permission:', error);
    res.status(500).json({ error: 'Failed to fetch permission' });
  }
}

async function createPermission(req, res) {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Permission name is required' });
    }
    const existing = await Permission.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({ error: 'Permission already exists' });
    }
    const permission = await Permission.create({ name, description });
    res.status(201).json(permission);
  } catch (error) {
    console.error('Error creating permission:', error);
    res.status(500).json({ error: 'Failed to create permission' });
  }
}

async function updatePermission(req, res) {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) {
      return res.status(404).json({ error: 'Permission not found' });
    }
    const { name, description } = req.body;
    await permission.update({ name, description });
    res.json(permission);
  } catch (error) {
    console.error('Error updating permission:', error);
    res.status(500).json({ error: 'Failed to update permission' });
  }
}

async function deletePermission(req, res) {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) {
      return res.status(404).json({ error: 'Permission not found' });
    }
    await permission.destroy();
    res.json({ message: 'Permission deleted successfully' });
  } catch (error) {
    console.error('Error deleting permission:', error);
    res.status(500).json({ error: 'Failed to delete permission' });
  }
}

module.exports = { getAllPermissions, getPermissionById, createPermission, updatePermission, deletePermission };
