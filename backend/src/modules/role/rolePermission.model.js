import { DataTypes } from '@sequelize/core';
import sequelize from '../../db/index.js';
import Role from './role.model.js';
import Permission from '../permission/permission.model.js';

const rolePermission = sequelize.define('RolePermission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
}, {
  timestamps: false,
});

Role.belongsToMany(Permission, { through: rolePermission, foreignKey: 'roleId' });
Permission.belongsToMany(Role, { through: rolePermission, foreignKey: 'permissionId' });

export default rolePermission;