const sequelize = require("../../db/index");
const { DataTypes } = require("sequelize");

const Restaurant = sequelize.define(
  "Restaurant",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { timestams: true },
);

Restaurant.associate = (models) => {
  Restaurant.hasMany(models.User, {
    foreignKey: "restaurantId",
    as: "users",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

module.exports = Restaurant;
