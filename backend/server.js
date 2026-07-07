const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const sequelize = require("./src/db/index");

const userRoutes = require('./src/modules/user/user.routes');
const authRoutes = require('./src/modules/auth/auth.routes');
const authMiddleware = require('./src/middlewares/auth.middleware');
const requireActiveSubscription = require('./src/middlewares/requireActiveSubscription.middleware');
const restaurantRoutes = require('./src/modules/restaurant/restaurant.routes');
const ingredientRoutes = require('./src/modules/inventory/ingredient.routes');
const { seedRolesAndPermissions } = require('./src/seed/rolesAndPermissions.seed');
const recipeRoutes = require('./src/modules/inventory/recipe.routes');
const permissionRoutes = require('./src/modules/permission/permission.routes');
const supplierRoutes = require('./src/modules/supplier/supplier.routes');
const purchaseOrderRoutes = require('./src/modules/purchaseOrder/purchaseOrder.routes');
const purchaseReturnRoutes = require('./src/modules/purchaseReturn/purchaseReturn.routes');
const paymentRoutes = require('./src/modules/payment/payment.routes');
const invoiceRoutes = require('./src/modules/invoice/invoice.routes');
const expenseRoutes = require('./src/modules/expense/expense.routes');
const goodsReceiptRoutes = require('./src/modules/goodsReceipt/goodsReceipt.routes');
const supplierInvoiceRoutes = require('./src/modules/supplierInvoice/supplierInvoice.routes');
const dashboardRoutes = require('./src/modules/dashboard/dashboard.routes');
const { scheduleDailySummaryJob } = require('./src/jobs/dailySummary.job');

// Import models
const User = require('./src/modules/user/user.model');
const Restaurant = require('./src/modules/restaurant/restaurant.model');
const Role = require('./src/modules/role/role.model');
const Ingredient = require('./src/modules/inventory/ingredient.model');
const StockMovement = require('./src/modules/inventory/stockMovement.model');
const Recipe = require('./src/modules/inventory/Recipe.modal');
const RecipeIngredient = require('./src/modules/inventory/RecipeIngredient.modal');
const RolePermission = require('./src/modules/role/rolePermission.model');
const Permission = require('./src/modules/permission/permission.model');
const Supplier = require('./src/modules/supplier/supplier.model');
const PurchaseOrder = require('./src/modules/purchaseOrder/purchaseOrder.model');
const PurchaseOrderItem = require('./src/modules/purchaseOrder/purchaseOrderItem.model');
const PurchaseReturn = require('./src/modules/purchaseReturn/purchaseReturn.model');
const PurchaseReturnItem = require('./src/modules/purchaseReturn/purchaseReturnItem.model');
const Payment = require('./src/modules/payment/payment.model');
const Invoice = require('./src/modules/invoice/invoice.model');
const InvoiceItem = require('./src/modules/invoice/invoiceItem.model');
const Expense = require('./src/modules/expense/expense.model');
const GoodsReceipt = require('./src/modules/goodsReceipt/goodsReceipt.model');
const GoodsReceiptItem = require('./src/modules/goodsReceipt/goodsReceiptItem.model');
const SupplierInvoice = require('./src/modules/supplierInvoice/supplierInvoice.model');
const SupplierInvoiceItem = require('./src/modules/supplierInvoice/supplierInvoiceItem.model');

// Collect models
const models = { User, Restaurant, Role, Ingredient, StockMovement, Recipe, RecipeIngredient, RolePermission, Permission, Supplier, PurchaseOrder, PurchaseOrderItem, PurchaseReturn, PurchaseReturnItem, Payment, Invoice, InvoiceItem, Expense, GoodsReceipt, GoodsReceiptItem, SupplierInvoice, SupplierInvoiceItem };

// Setup associations
Object.values(models).forEach((model) => {
  console.log(`Setting up associations for model: ${model.name}`);
  if (model.associate) {
    console.log(`Associating model: ${model.name}`);
    model.associate(models);
  }
});

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  }),
);

// Webhook must be registered before express.json() - to check why 
const subscriptionController = require('./src/modules/subscription/subscription.controller');
app.post('/api/subscription/webhook', express.raw({ type: 'application/json' }), subscriptionController.handleWebhook);

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    // Authenticate database
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    if (process.env.NODE_ENV === "dev") {
      // Sync all models and associations
      await sequelize.sync({ alter: true });
      console.log(
        "All models and associations were synchronized successfully.",
      );

      // Seed roles and permissions
      await seedRolesAndPermissions(models);
    }

    scheduleDailySummaryJob();
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

// Start server
startServer();

// Routes
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', authMiddleware, requireActiveSubscription, restaurantRoutes);
app.use('/api/ingredients', authMiddleware, requireActiveSubscription, ingredientRoutes);
app.use('/api/recipes', authMiddleware, requireActiveSubscription, recipeRoutes);
app.use('/api/permissions', authMiddleware, permissionRoutes);
app.use('/api/suppliers', authMiddleware, requireActiveSubscription, supplierRoutes);
app.use('/api/purchaseOrders', authMiddleware, requireActiveSubscription, purchaseOrderRoutes);
app.use('/api/purchaseReturns', authMiddleware, requireActiveSubscription, purchaseReturnRoutes);
app.use('/api/payments', authMiddleware, requireActiveSubscription, paymentRoutes);
app.use('/api/invoices', authMiddleware, requireActiveSubscription, invoiceRoutes);
app.use('/api/expenses', authMiddleware, requireActiveSubscription, expenseRoutes);
app.use('/api/goodsReceipts', authMiddleware, requireActiveSubscription, goodsReceiptRoutes);
app.use('/api/supplierInvoices', authMiddleware, requireActiveSubscription, supplierInvoiceRoutes);
app.use('/api/subscription', authMiddleware, require('./src/modules/subscription/subscription.routes'));
app.use("/api/restaurants", restaurantRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Restaurant Management API");
});

app.listen(port, () => {
  console.log(`Example app listening on port: http://localhost:${port}`);
});
