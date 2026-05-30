const sequelize = require('../../db/index');
const { DataTypes } = require('sequelize');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  purchaseOrderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  restaurantId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  method: {
    type: DataTypes.ENUM('Cash', 'BankTransfer', 'Check', 'Card', 'Other'),
    allowNull: false,
    defaultValue: 'Cash',
  },
  status: {
    type: DataTypes.ENUM('Paid', 'Partial', 'Unpaid'),
    allowNull: false,
    defaultValue: 'Unpaid',
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

Payment.associate = (models) => {
  Payment.belongsTo(models.Supplier, {
    foreignKey: 'supplierId',
    as: 'supplier',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  });
  Payment.belongsTo(models.PurchaseOrder, {
    foreignKey: 'purchaseOrderId',
    as: 'purchaseOrder',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
  Payment.belongsTo(models.Restaurant, {
    foreignKey: 'restaurantId',
    as: 'restaurant',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

module.exports = Payment;
