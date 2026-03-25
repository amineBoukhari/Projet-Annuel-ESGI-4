const sequelize = require('../../db/index');
const { DataTypes } = require('sequelize');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  restaurantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'draft',
  },
  issueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  totalHT: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  totalTTC: {
    type: DataTypes.DECIMAL(10, 2),
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


Invoice.associate = (models) => {
  Invoice.belongsTo(models.Restaurant, {
    foreignKey: 'restaurantId',
    as: 'restaurant',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

module.exports = Invoice;
