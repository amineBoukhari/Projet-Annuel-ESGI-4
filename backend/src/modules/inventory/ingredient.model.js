const sequelize = require('../../db/index');
const { DataTypes } = require('sequelize');

const Ingredient = sequelize.define('Ingredient', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unit : {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stockQuantity: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  minStockLevel: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  imageUrl: {
  type: DataTypes.STRING,
  allowNull: true,
},
}, {
  timestamps: false,
});

Ingredient.associate = (models) => {

  Ingredient.hasMany(models.StockMovement, { 
    foreignKey: 'ingredientId', 
    as: 'stockMovements',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });

};


module.exports = Ingredient;