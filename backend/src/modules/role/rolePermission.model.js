const { DataTypes } = require('sequelize');
const sequelize = require('../../db/index');

const RolePermission = sequelize.define('RolePermission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  permissionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: false,
});

RolePermission.associate = (models) => {
  RolePermission.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
  RolePermission.belongsTo(models.Permission, { foreignKey: 'permissionId', as: 'permission' });
};

module.exports = RolePermission;