const sequelize = require('../../db/index');
const { DataTypes } = require('sequelize');

const InvoiceItem = sequelize.define('InvoiceItem', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  invoiceId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  timestamps: false,
});

InvoiceItem.associate = (models) => {
  InvoiceItem.belongsTo(models.Invoice, {
    foreignKey: 'invoiceId',
    as: 'invoice',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  InvoiceItem.belongsTo(models.Recipe, {
    foreignKey: 'recipeId',
    as: 'recipe',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
};

module.exports = InvoiceItem;
