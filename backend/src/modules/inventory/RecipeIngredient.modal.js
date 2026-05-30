const sequelize = require("../../db/index");
const { DataTypes } = require("sequelize");

const RecipeIngredient = sequelize.define("RecipeIngredient", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "unit",
  },
});

module.exports = RecipeIngredient;
