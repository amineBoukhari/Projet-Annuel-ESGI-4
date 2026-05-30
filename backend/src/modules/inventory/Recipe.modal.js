const sequelize = require("../../db/index");
const { DataTypes } = require("sequelize");

const Recipe = sequelize.define(
  "Recipe",
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  },
);

Recipe.associate = (models) => {
  Recipe.belongsToMany(models.Ingredient, {
    through: models.RecipeIngredient,
    foreignKey: "recipeId",
    as: "ingredients",
  });
};
module.exports = Recipe;
