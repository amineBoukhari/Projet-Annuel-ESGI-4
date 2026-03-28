const sequelize = require('../../db/index');
const { DataTypes } = require('sequelize');
const Ingredient = require('./ingredient.model');


const StockMovement = sequelize.define("StockMovement",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        ingredientId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        }

    }
)

StockMovement.associate = (models) => {

  StockMovement.belongsTo(models.Ingredient, { 
    foreignKey: 'ingredientId', 
    as: 'ingredient',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });

};


module.exports = StockMovement;