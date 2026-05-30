const { seedRolesAndPermissions } = require("./rolesAndPermissions.seed");

// Import models
const User = require("../modules/user/user.model");
const Restaurant = require("../modules/restaurant/restaurant.model");
const Role = require("../modules/role/role.model");
const Ingredient = require("../modules/inventory/ingredient.model");
const StockMovement = require("../modules/inventory/stockMovement.model");
const Recipe = require("../modules/inventory/Recipe.modal");
const RecipeIngredient = require("../modules/inventory/RecipeIngredient.modal");
const RolePermission = require("../modules/role/rolePermission.model");
const Permission = require("../modules/permission/permission.model");
const Supplier = require("../modules/supplier/supplier.model");
const PurchaseOrder = require("../modules/purchaseOrder/purchaseOrder.model");
const PurchaseOrderItem = require("../modules/purchaseOrder/purchaseOrderItem.model");
const PurchaseReturn = require("../modules/purchaseReturn/purchaseReturn.model");
const PurchaseReturnItem = require("../modules/purchaseReturn/purchaseReturnItem.model");
const Payment = require("../modules/payment/payment.model");

const models = {
  User,
  Restaurant,
  Role,
  Ingredient,
  StockMovement,
  Recipe,
  RecipeIngredient,
  RolePermission,
  Permission,
  Supplier,
  PurchaseOrder,
  PurchaseOrderItem,
  PurchaseReturn,
  PurchaseReturnItem,
  Payment,
};

async function runSeed() {
  try {
    console.log("✅ DB connected");

    await seedRolesAndPermissions(models);
    console.log("✅ Seeding done");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding:", error);
    process.exit(1);
  }
}

runSeed();
