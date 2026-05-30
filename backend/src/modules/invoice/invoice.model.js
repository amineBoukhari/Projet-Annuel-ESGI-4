const sequelize = require('../../db/index');
const { DataTypes } = require('sequelize');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  restaurantId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('draft', 'validated', 'paid', 'cancelled'),
    allowNull: false,
    defaultValue: 'draft',
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  validatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
});

Invoice.associate = (models) => {
  Invoice.belongsTo(models.Restaurant, {
    foreignKey: 'restaurantId',
    as: 'restaurant',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Invoice.belongsTo(models.User, {
    foreignKey: 'createdBy',
    as: 'creator',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
  Invoice.hasMany(models.InvoiceItem, {
    foreignKey: 'invoiceId',
    as: 'items',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

module.exports = Invoice;
