const sequelize = require('../../db/index');
const { DataTypes } = require('sequelize');

const PurchaseReturn = sequelize.define('PurchaseReturn', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  restaurantId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  purchaseOrderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
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

PurchaseReturn.associate = (models) => {
  PurchaseReturn.belongsTo(models.Supplier, {
    foreignKey: 'supplierId',
    as: 'supplier',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  });
  PurchaseReturn.belongsTo(models.Restaurant, {
    foreignKey: 'restaurantId',
    as: 'restaurant',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  PurchaseReturn.belongsTo(models.PurchaseOrder, {
    foreignKey: 'purchaseOrderId',
    as: 'purchaseOrder',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
  PurchaseReturn.belongsTo(models.User, {
    foreignKey: 'createdBy',
    as: 'creator',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
  PurchaseReturn.hasMany(models.PurchaseReturnItem, {
    foreignKey: 'purchaseReturnId',
    as: 'items',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

module.exports = PurchaseReturn;
