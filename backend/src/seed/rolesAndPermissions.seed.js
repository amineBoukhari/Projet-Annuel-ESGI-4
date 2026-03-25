const Role = require('../modules/role/role.model');
const Permission = require('../modules/permission/permission.model');
const RolePermission = require('../modules/role/rolePermission.model');
const { Op } = require('sequelize');

console.log('Role:', Role);
console.log('Permission:', Permission);
console.log('RolePermission:', RolePermission);
console.log('setPermissions:', typeof Role.prototype.setPermissions);
console.log('Role associations:', Role.associations);


console.log('🔄 Seeding roles and permissions...');

const ROLES = [
  { name: 'Admin'},
  { name: 'Manager' },
  { name: 'Employee' },
];

const PERMISSIONS = [
  { name: 'create_user'},
  { name: 'delete_user' },
  { name: 'view_restaurant' },
  { name: 'create_restaurant' },
];

async function seedRolesAndPermissions() {
  for (const perm of PERMISSIONS) {
    try {
      await Permission.findOrCreate({
        where: { name: perm.name },
        defaults: { name: perm.name },
      });
    } catch (error) {
      console.error(`❌ Error seeding permission ${perm.name}:`, error);
    }
  }

  for (const role of ROLES) {
    try {
      await Role.findOrCreate({
        where: { name: role.name },
        defaults: { name: role.name },
      });
    } catch (error) {
      console.error(`❌ Error seeding role ${role.name}:`, error);
    }
  }

  console.log('setPermissions type:', typeof Role.prototype.setPermissions);
  const adminRole = await Role.findOne({ where: { name: 'Admin' } });
  if (adminRole) {
    const allPermissions = await Permission.findAll();
    await adminRole.setPermissions(allPermissions);
  }

  const managerRole = await Role.findOne({ where: { name: 'Manager' } });
  if (managerRole) {
    const managerPerms = await Permission.findAll({
      where: { name: { [Op.in]: ['create_restaurant', 'view_restaurant'] } },
    });
    await managerRole.setPermissions(managerPerms);
  }
}

module.exports = { seedRolesAndPermissions, ROLES, PERMISSIONS };