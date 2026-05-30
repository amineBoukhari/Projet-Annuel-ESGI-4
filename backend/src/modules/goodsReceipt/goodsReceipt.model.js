const sequelize = require('../../db/index');
const { DataTypes } = require('sequelize');

const GoodsReceipt = sequelize.define('GoodsReceipt', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  purchaseOrderId: {
    type: DataTypes.INTEGER,
    allowNull: true, // can be null for ad-hoc receipts
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  restaurantId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  receiptDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('draft', 'received', 'partial', 'rejected'),
    allowNull: false,
    defaultValue: 'draft',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
}, {
  timestamps: true,
});

GoodsReceipt.associate = (models) => {
  GoodsReceipt.belongsTo(models.PurchaseOrder, {
    foreignKey: 'purchaseOrderId',
    as: 'purchaseOrder',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
  GoodsReceipt.belongsTo(models.Supplier, {
    foreignKey: 'supplierId',
    as: 'supplier',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  });
  GoodsReceipt.belongsTo(models.Restaurant, {
    foreignKey: 'restaurantId',
    as: 'restaurant',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  GoodsReceipt.belongsTo(models.User, {
    foreignKey: 'createdBy',
    as: 'creator',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
  GoodsReceipt.hasMany(models.GoodsReceiptItem, {
    foreignKey: 'goodsReceiptId',
    as: 'items',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  GoodsReceipt.hasOne(models.SupplierInvoice, {
    foreignKey: 'goodsReceiptId',
    as: 'supplierInvoice',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
};

module.exports = GoodsReceipt;
