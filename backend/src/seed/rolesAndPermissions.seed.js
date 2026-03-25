import Role from '../modules/role/role.model.js';
import Permission from '../modules/permission/permission.model.js';
import RolePermission from '../modules/role/rolePermission.model.js';


const ROLES = [
  { name: 'Owner', description: 'Full access' },
  { name: 'Manager', description: 'Manage restaurants and users' },
  { name: 'Employee', description: 'Limited access' },
];


const PERMISSIONS = [
  { name: 'create_user', description: 'Can create users' },
  { name: 'delete_user', description: 'Can delete users' },
  { name: 'view_restaurant', description: 'Can view restaurants' },
  { name: 'create_restaurant', description: 'Can create restaurants' },
 
];

const ROLE_PERMISSIONS = [
  { roleName: 'Owner', permissionNames: ['create_user', 'delete_user', 'view_restaurant', 'create_restaurant'] },
  { roleName: 'Manager', permissionNames: ['view_restaurant', 'create_restaurant'] },
  { roleName: 'Employee', permissionNames: ['view_restaurant'] },
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


  for (const rp of ROLE_PERMISSIONS) {
    const role = await Role.findOne({ where: { name: rp.roleName } });
    const permissions = await Permission.findAll({
      where: { name: rp.permissionNames },
    });
    await role.setPermissions(permissions);
  }
}