const sequelize = require('../../db/index');
const { DataTypes } = require('sequelize');

const PurchaseOrderItem = sequelize.define('PurchaseOrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  purchaseOrderId: {
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
  unitPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  timestamps: false,
});

PurchaseOrderItem.associate = (models) => {
  PurchaseOrderItem.belongsTo(models.PurchaseOrder, {
    foreignKey: 'purchaseOrderId',
    as: 'purchaseOrder',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  PurchaseOrderItem.belongsTo(models.Ingredient, {
    foreignKey: 'ingredientId',
    as: 'ingredient',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  });
};

module.exports = PurchaseOrderItem;
