const sequelize = require('../../db/index');
const { DataTypes } = require('sequelize');

const SupplierInvoiceItem = sequelize.define('SupplierInvoiceItem', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  supplierInvoiceId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  ingredientId: {
    type: DataTypes.INTEGER,
    allowNull: true, // can be null for non-stock items like services
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 1,
  },
  unitPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  timestamps: true,
});

SupplierInvoiceItem.associate = (models) => {
  SupplierInvoiceItem.belongsTo(models.SupplierInvoice, {
    foreignKey: 'supplierInvoiceId',
    as: 'supplierInvoice',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  SupplierInvoiceItem.belongsTo(models.Ingredient, {
    foreignKey: 'ingredientId',
    as: 'ingredient',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
};

module.exports = SupplierInvoiceItem;
