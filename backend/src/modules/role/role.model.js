const sequelize = require('../../db/index');
const RolePermission = require('./rolePermission.model');
const Permission = require('../permission/permission.model');
const { DataTypes } = require('sequelize');

const Role = sequelize.define('Role' ,{
   id : {
       type: DataTypes.INTEGER,
       primaryKey: true,
       autoIncrement: true
   },
   name :  {
       type: DataTypes.STRING,
       allowNull: false
   }
})

Role.associate = () => {
  Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'roleId', as: 'permissions' });
};

module.exports = Role;