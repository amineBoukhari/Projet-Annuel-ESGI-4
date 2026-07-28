const sequelize = require("../../db/index");
const { DataTypes } = require("sequelize");

const Restaurant = sequelize.define(
  "Restaurant",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    adress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    whatsappNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stripeCustomerId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stripeSubscriptionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subscriptionStatus: {
      type: DataTypes.ENUM('active', 'trialing', 'past_due', 'canceled', 'unpaid', 'inactive'),
      defaultValue: 'inactive',
    },
    subscriptionPlan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trialEndsAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    currentPeriodEnd: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { timestams: true },
);

Restaurant.associate = (models) => {
  Restaurant.hasMany(models.User, {
    foreignKey: "restaurantId",
    as: "users",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Restaurant.hasMany(models.GoodsReceipt, {
    foreignKey: "restaurantId",
    as: "goodsReceipts",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Restaurant.hasMany(models.SupplierInvoice, {
    foreignKey: "restaurantId",
    as: "supplierInvoices",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

module.exports = Restaurant;
