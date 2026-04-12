const sequelize = require("../../db/index");
const { DataTypes } = require("sequelize");

const Role = sequelize.define("Role", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Role.associate = (models) => {
  Role.belongsToMany(models.Permission, { through: models.RolePermission, foreignKey: 'roleId', as: 'permissions' });
};

module.exports = Role;
