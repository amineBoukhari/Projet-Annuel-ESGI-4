const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const sequelize = require("./src/db/index");

const userRoutes = require("./src/modules/user/user.routes");
const authRoutes = require("./src/modules/auth/auth.routes");
const authMiddleware = require("./src/middlewares/auth.middleware");
const restaurantRoutes = require("./src/modules/restaurant/restaurant.routes");
const ingredientRoutes = require("./src/modules/inventory/ingredient.routes");
const {
  seedRolesAndPermissions,
} = require("./src/seed/rolesAndPermissions.seed");
const recipeRoutes = require("./src/modules/inventory/recipe.routes");
const permissionRoutes = require("./src/modules/permission/permission.routes");

// Import models
const User = require("./src/modules/user/user.model");
const Restaurant = require("./src/modules/restaurant/restaurant.model");
const Role = require("./src/modules/role/role.model");
const Ingredient = require("./src/modules/inventory/ingredient.model");
const StockMovement = require("./src/modules/inventory/stockMovement.model");
const Recipe = require("./src/modules/inventory/Recipe.modal");
const RecipeIngredient = require("./src/modules/inventory/RecipeIngredient.modal");
const RolePermission = require("./src/modules/role/rolePermission.model");
const Permission = require("./src/modules/permission/permission.model");

// Collect models
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
};

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
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

// Start server
startServer();

// Routes
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", authMiddleware, restaurantRoutes);
app.use("/api/ingredients", authMiddleware, ingredientRoutes);
app.use("/api/recipes", authMiddleware, recipeRoutes);
app.use("/api/permissions", authMiddleware, permissionRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Restaurant Management API");
});

app.listen(port, () => {
  console.log(`Example app listening on port: http://localhost:${port}`);
});
