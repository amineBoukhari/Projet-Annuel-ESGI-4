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
