import Role from '../modules/role/role.model.js';
import Permission from '../modules/permission/permission.model.js';
import RolePermission from '../modules/role/rolePermission.model.js';


export const ROLES = [
  { name: 'Owner', description: 'Full access' },
  { name: 'Manager', description: 'Manage restaurants and users' },
  { name: 'Employee', description: 'Limited access' },
];


export const PERMISSIONS = [
  { name: 'create_user', description: 'Can create users' },
  { name: 'delete_user', description: 'Can delete users' },
  { name: 'view_restaurant', description: 'Can view restaurants' },
  { name: 'create_restaurant', description: 'Can create restaurants' },
 
];


export async function seedRolesAndPermissions() {

  for (const perm of PERMISSIONS) {
    await Permission.findOrCreate({
      where: { name: perm.name },
      defaults: perm,
    });
  }

 
  for (const role of ROLES) {
    await Role.findOrCreate({
      where: { name: role.name },
      defaults: role,
    });
  }


  const adminRole = await Role.findOne({ where: { name: 'Admin' } });
  const allPermissions = await Permission.findAll();
  await adminRole.setPermissions(allPermissions);

  const managerRole = await Role.findOne({ where: { name: 'Manager' } });
  const managerPerms = await Permission.findAll({
    where: { name: ['create_restaurant', 'view_restaurant'] },
  });
  await managerRole.setPermissions(managerPerms);
}