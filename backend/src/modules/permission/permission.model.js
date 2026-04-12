const sequelize = require("../../db/index");
const { DataTypes } = require("sequelize");

const Permission = sequelize.define(
  "Permission",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

Permission.associate = (models) => {
  Permission.belongsToMany(models.Role, { through: models.RolePermission, foreignKey: 'permissionId', as: 'roles' });
};

module.exports = Permission;
