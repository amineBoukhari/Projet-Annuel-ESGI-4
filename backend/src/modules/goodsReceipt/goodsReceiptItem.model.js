const sequelize = require('../../db/index');
const { DataTypes } = require('sequelize');

const GoodsReceiptItem = sequelize.define('GoodsReceiptItem', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  goodsReceiptId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  ingredientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expectedQuantity: {
    type: DataTypes.FLOAT,
    allowNull: true, // null if ad-hoc receipt without PO
  },
  receivedQuantity: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  unitPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

GoodsReceiptItem.associate = (models) => {
  GoodsReceiptItem.belongsTo(models.GoodsReceipt, {
    foreignKey: 'goodsReceiptId',
    as: 'goodsReceipt',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  GoodsReceiptItem.belongsTo(models.Ingredient, {
    foreignKey: 'ingredientId',
    as: 'ingredient',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  });
};

module.exports = GoodsReceiptItem;
