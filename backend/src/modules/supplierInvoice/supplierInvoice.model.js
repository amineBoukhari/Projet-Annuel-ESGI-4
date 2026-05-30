const sequelize = require('../../db/index');
const { DataTypes } = require('sequelize');

const SupplierInvoice = sequelize.define('SupplierInvoice', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  goodsReceiptId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  purchaseOrderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  restaurantId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  invoiceDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('draft', 'validated', 'paid', 'overdue'),
    allowNull: false,
    defaultValue: 'draft',
  },
  subtotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  tax: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
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

SupplierInvoice.associate = (models) => {
  SupplierInvoice.belongsTo(models.GoodsReceipt, {
    foreignKey: 'goodsReceiptId',
    as: 'goodsReceipt',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
  SupplierInvoice.belongsTo(models.PurchaseOrder, {
    foreignKey: 'purchaseOrderId',
    as: 'purchaseOrder',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
  SupplierInvoice.belongsTo(models.Supplier, {
    foreignKey: 'supplierId',
    as: 'supplier',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  });
  SupplierInvoice.belongsTo(models.Restaurant, {
    foreignKey: 'restaurantId',
    as: 'restaurant',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  SupplierInvoice.belongsTo(models.User, {
    foreignKey: 'createdBy',
    as: 'creator',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
  SupplierInvoice.hasMany(models.SupplierInvoiceItem, {
    foreignKey: 'supplierInvoiceId',
    as: 'items',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

module.exports = SupplierInvoice;
