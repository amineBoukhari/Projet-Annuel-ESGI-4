const sequelize = require('../../db/index');
const { DataTypes } = require('sequelize');

const PurchaseReturnItem = sequelize.define('PurchaseReturnItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  purchaseReturnId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ingredientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false,
});

PurchaseReturnItem.associate = (models) => {
  PurchaseReturnItem.belongsTo(models.PurchaseReturn, {
    foreignKey: 'purchaseReturnId',
    as: 'purchaseReturn',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  PurchaseReturnItem.belongsTo(models.Ingredient, {
    foreignKey: 'ingredientId',
    as: 'ingredient',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  });
};

module.exports = PurchaseReturnItem;
