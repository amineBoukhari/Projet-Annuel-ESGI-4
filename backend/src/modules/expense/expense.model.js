const sequelize = require('../../db/index');
const { DataTypes } = require('sequelize');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  restaurantId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('utility', 'rent', 'transport', 'supplies', 'maintenance', 'other'),
    allowNull: false,
    defaultValue: 'other',
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  expenseDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  scannedImageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
}, {
  timestamps: true,
});

Expense.associate = (models) => {
  Expense.belongsTo(models.Restaurant, {
    foreignKey: 'restaurantId',
    as: 'restaurant',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Expense.belongsTo(models.User, {
    foreignKey: 'createdBy',
    as: 'creator',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
};

module.exports = Expense;
