const User = require('../modules/user/user.model');
const authtService = require('../modules/auth/auth.service');

const INGREDIENTS = [
  { name: 'Flour', unit: 'kg', stockQuantity: 100, minStockLevel: 20 , imageUrl: 'https://example.com/images/flour.jpg'},
  { name: 'Sugar', unit: 'kg', stockQuantity: 50, minStockLevel: 10 , imageUrl: 'https://example.com/images/sugar.jpg'},
  { name: 'Eggs', unit: 'pcs', stockQuantity: 200, minStockLevel: 50 , imageUrl: 'https://example.com/images/eggs.jpg'},
  { name: 'Butter', unit: 'kg', stockQuantity: 30, minStockLevel: 5 , imageUrl: 'https://example.com/images/butter.jpg'},
  { name: 'Milk', unit: 'liters', stockQuantity: 100, minStockLevel: 20 , imageUrl: 'https://example.com/images/milk.jpg'},
];


const RECIPES = [
  { name: 'Pancakes', description: 'Fluffy pancakes made with flour, eggs, milk, and butter.' },
  { name: 'Chocolate Cake', description: 'Rich chocolate cake made with flour, sugar, eggs, and butter.' },
  { name: 'Omelette', description: 'Classic omelette made with eggs, milk, and butter.' },
  { name: 'Bread', description: 'Freshly baked bread made with flour, water, yeast, and salt.' },
  { name: 'Cookies', description: 'Delicious cookies made with flour, sugar, eggs, and butter.' },
];

const INGREDIENTS_RECIPES = [
  {
    recipeName: 'Pancakes',
    ingredients: [
      { name: 'Flour',  quantity: 200, unit: 'g' },
      { name: 'Eggs',   quantity: 2,   unit: 'pcs' },
      { name: 'Milk',   quantity: 100, unit: 'ml' },
      { name: 'Butter', quantity: 50,  unit: 'g' },
    ],
  },
  {
    recipeName: 'Chocolate Cake',
    ingredients: [
      { name: 'Flour',  quantity: 300, unit: 'g' },
      { name: 'Sugar',  quantity: 200, unit: 'g' },
      { name: 'Eggs',   quantity: 3,   unit: 'pcs' },
      { name: 'Butter', quantity: 100, unit: 'g' },
    ],
  },
  {
    recipeName: 'Omelette',
    ingredients: [
      { name: 'Eggs',   quantity: 3,  unit: 'pcs' },
      { name: 'Milk',   quantity: 50, unit: 'ml' },
      { name: 'Butter', quantity: 20, unit: 'g' },
    ],
  },
  {
    recipeName: 'Bread',
    ingredients: [
      { name: 'Flour', quantity: 500, unit: 'g' },
    ],
  },
  {
    recipeName: 'Cookies',
    ingredients: [
      { name: 'Flour',  quantity: 250, unit: 'g' },
      { name: 'Sugar',  quantity: 150, unit: 'g' },
      { name: 'Eggs',   quantity: 2,   unit: 'pcs' },
      { name: 'Butter', quantity: 100, unit: 'g' },
    ],
  },
];

const STOCK_MOVEMENTS = [
  { ingredientId: 1, reason: 'Initial Stock 1', quantity: 100, date: new Date() },
  { ingredientId: 2, reason: 'Initial Stock 2', quantity: 50, date: new Date() },
  { ingredientId: 3, reason: 'Initial Stock 3', quantity: 200, date: new Date() },
  { ingredientId: 4, reason: 'Initial Stock 4', quantity: 30, date: new Date() },
  { ingredientId: 5, reason: 'Initial Stock 5', quantity: 100, date: new Date()},
];

const ROLES = [
  {
    name: "Admin",
    description: "Full system access - manages the platform itself",
  },
  { name: "Owner", description: "Full access to their restaurant data" },
  { name: "Manager", description: "Manage restaurants and users" },
  { name: "Employee", description: "Limited access" },
];

const PERMISSIONS = [
  // Users
  { name: "create_user", description: "Can create users" },
  { name: "read_user", description: "Can read users" },
  { name: "update_user", description: "Can update users" },
  { name: "delete_user", description: "Can delete users" },
  { name: "assign_roles", description: "Can assign roles to users" },

  // Roles & Permissions
  { name: "create_role", description: "Can create roles" },
  { name: "read_role", description: "Can read roles" },
  { name: "update_role", description: "Can update roles" },
  { name: "delete_role", description: "Can delete roles" },

  // Restaurants
  { name: "create_restaurant", description: "Can create restaurants" },
  { name: "read_restaurant", description: "Can view restaurants" },
  { name: "update_restaurant", description: "Can update restaurants" },
  { name: "delete_restaurant", description: "Can delete restaurants" },

  // Dashboard & Stats
  { name: "read_dashboard", description: "Can view dashboard and statistics" },
  { name: "read_own_dashboard", description: "Can view own dashboard only" },

  // Invoices
  { name: "create_invoice", description: "Can create invoices" },
  { name: "read_invoice", description: "Can read invoices" },
  { name: "update_invoice", description: "Can update invoices" },
  { name: "delete_invoice", description: "Can delete invoices" },
  { name: "export_invoice", description: "Can export invoices to PDF" },
  { name: "print_invoice", description: "Can print invoices" },

  // Payments
  { name: "create_payment", description: "Can create payments" },
  { name: "read_payment", description: "Can read payments" },
  { name: "update_payment", description: "Can update payments" },

  // Reports
  { name: "read_report", description: "Can read reports" },
  { name: "generate_report", description: "Can generate reports" },

  // Stock
  { name: "create_stock", description: "Can add products to stock" },
  { name: "read_stock", description: "Can view stock" },
  { name: "update_stock", description: "Can update stock quantities" },
  { name: "delete_stock", description: "Can delete stock entries" },
  { name: "add_expiry_date", description: "Can add expiry dates to products" },

  // Waste & Expiry
  { name: "read_waste", description: "Can view waste and expiry data" },
  {
    name: "manage_waste",
    description: "Can manage waste and expired products",
  },

  // Suppliers
  { name: "create_supplier", description: "Can create suppliers" },
  { name: "read_supplier", description: "Can view suppliers" },
  { name: "update_supplier", description: "Can update suppliers" },
  { name: "delete_supplier", description: "Can delete suppliers" },
  {
    name: "compare_supplier_prices",
    description: "Can compare prices between suppliers",
  },

  // Supplier Orders
  { name: "create_supplier_order", description: "Can create supplier orders" },
  { name: "read_supplier_order", description: "Can view supplier orders" },
  { name: "update_supplier_order", description: "Can update supplier orders" },
  { name: "delete_supplier_order", description: "Can delete supplier orders" },

  // Planning
  { name: "create_planning", description: "Can create planning entries" },
  { name: "read_planning", description: "Can view all planning" },
  { name: "read_own_planning", description: "Can view own planning only" },
  { name: "update_planning", description: "Can update planning entries" },
  { name: "delete_planning", description: "Can delete planning entries" },
  {
    name: "request_planning_modification",
    description: "Can request planning modifications",
  },
  {
    name: "set_planning_constraints",
    description: "Can set planning constraints",
  },

  // Alerts
  { name: "receive_all_alerts", description: "Can receive all alerts" },
  { name: "receive_stock_alerts", description: "Can receive stock alerts" },
  { name: "receive_expiry_alerts", description: "Can receive expiry alerts" },
  {
    name: "receive_planning_alerts",
    description: "Can receive planning alerts",
  },
  {
    name: "receive_own_planning_alerts",
    description: "Can receive own planning alerts only",
  },
  {
    name: "receive_price_alerts",
    description: "Can receive supplier price variation alerts",
  },
];

const ROLE_PERMISSIONS = [
  {
    roleName: "Admin",
    permissionNames: [
      // Users
      "create_user",
      "read_user",
      "update_user",
      "delete_user",
      "assign_roles",
      // Roles
      "create_role",
      "read_role",
      "update_role",
      "delete_role",
      // Restaurants
      "create_restaurant",
      "read_restaurant",
      "update_restaurant",
      "delete_restaurant",
      // Dashboard
      "read_dashboard",
      // Invoices
      "create_invoice",
      "read_invoice",
      "update_invoice",
      "delete_invoice",
      "export_invoice",
      "print_invoice",
      // Payments
      "create_payment",
      "read_payment",
      "update_payment",
      // Reports
      "read_report",
      "generate_report",
      // Stock
      "create_stock",
      "read_stock",
      "update_stock",
      "delete_stock",
      "add_expiry_date",
      // Waste
      "read_waste",
      "manage_waste",
      // Suppliers
      "create_supplier",
      "read_supplier",
      "update_supplier",
      "delete_supplier",
      "compare_supplier_prices",
      // Supplier Orders
      "create_supplier_order",
      "read_supplier_order",
      "update_supplier_order",
      "delete_supplier_order",
      // Planning
      "create_planning",
      "read_planning",
      "update_planning",
      "delete_planning",
      "set_planning_constraints",
      // Alerts
      "receive_all_alerts",
    ],
  },
  {
    roleName: "Owner",
    permissionNames: [
      // Users
      "create_user",
      "read_user",
      "update_user",
      "delete_user",
      // Restaurants
      "create_restaurant",
      "read_restaurant",
      "update_restaurant",
      "delete_restaurant",
      // Dashboard
      "read_dashboard",
      // Invoices
      "create_invoice",
      "read_invoice",
      "update_invoice",
      "delete_invoice",
      "export_invoice",
      "print_invoice",
      // Payments
      "create_payment",
      "read_payment",
      "update_payment",
      // Reports
      "read_report",
      "generate_report",
      // Stock
      "create_stock",
      "read_stock",
      "update_stock",
      "delete_stock",
      "add_expiry_date",
      // Waste
      "read_waste",
      "manage_waste",
      // Suppliers
      "create_supplier",
      "read_supplier",
      "update_supplier",
      "delete_supplier",
      "compare_supplier_prices",
      // Supplier Orders
      "create_supplier_order",
      "read_supplier_order",
      "update_supplier_order",
      "delete_supplier_order",
      // Planning
      "create_planning",
      "read_planning",
      "update_planning",
      "delete_planning",
      "set_planning_constraints",
      // Alerts
      "receive_all_alerts",
    ],
  },
  {
    roleName: "Manager",
    permissionNames: [
      // Users
      "read_user",
      // Restaurants
      "read_restaurant",
      // Dashboard
      "read_dashboard",
      // Invoices
      "create_invoice",
      "read_invoice",
      "update_invoice",
      // Payments
      "read_payment",
      // Reports
      "read_report",
      "generate_report",
      // Stock
      "create_stock",
      "read_stock",
      "update_stock",
      // Waste
      "read_waste",
      "manage_waste",
      // Suppliers
      "create_supplier",
      "read_supplier",
      "update_supplier",
      // Supplier Orders
      "create_supplier_order",
      "read_supplier_order",
      // Planning
      "create_planning",
      "read_planning",
      "update_planning",
      "delete_planning",
      // Alerts
      "receive_stock_alerts",
      "receive_expiry_alerts",
      "receive_planning_alerts",
      "receive_price_alerts",
    ],
  },
  {
    roleName: "Employee",
    permissionNames: [
      // Dashboard
      "read_own_dashboard",
      // Stock
      "update_stock",
      "add_expiry_date",
      // Planning
      "read_own_planning",
      "request_planning_modification",
      // Alerts
      "receive_own_planning_alerts",
    ],
  },
];



async function seedRolesAndPermissions(models) {


    for (const ingredient of INGREDIENTS) {
    await models.Ingredient.findOrCreate({
      where: { name: ingredient.name },
      defaults: ingredient,
    });
  }

  for (const stockM of STOCK_MOVEMENTS) {
    await models.StockMovement.findOrCreate(
      {
        where : {reason :stockM.reason},
        defaults : stockM
      }
    )
  }



  for (const recipe of RECIPES) {
    await models.Recipe.findOrCreate({
      where: { name: recipe.name },
      defaults: recipe,
    });
  }


  for (const perm of PERMISSIONS) {
    await models.Permission.findOrCreate({
      where: { name: perm.name },
      defaults: perm,
    });
  }

  for (const role of ROLES) {
    await models.Role.findOrCreate({
      where: { name: role.name },
      defaults: role,
    });
  }

  for (const rp of ROLE_PERMISSIONS) {
    const role = await models.Role.findOne({ where: { name: rp.roleName } });
    const permissions = await models.Permission.findAll({
      where: { name: rp.permissionNames },
    });
    await role.setPermissions(permissions);
  }

  for (const ir of INGREDIENTS_RECIPES) {
    const recipe = await models.Recipe.findOne({ where: { name: ir.recipeName } });

    for (const ing of ir.ingredients) {
      const ingredient = await models.Ingredient.findOne({ where: { name: ing.name } });

      await models.RecipeIngredient.findOrCreate({
        where: { 
          recipeId: recipe.id, 
          ingredientId: ingredient.id 
        },
        defaults: {
          quantity: ing.quantity,
          unit: ing.unit,
        },
      });
    }
}


    models.User.findOrCreate({
    where: { email: 'admin@gmail.com' },
    defaults: {
      username: " Super Admin",
      email: "admin@gmail.com",
      password: await authService.hashPassword("admin123"),
      roleId: 1, // Assuming the Admin role has ID 1
    },
  });

  User.findOrCreate({
    where: { email: "johndoe@gmail.com" },
    defaults: {
      username: "John Doe",
      email: "johndoe@gmail.com",
      password: await authService.hashPassword("xxx"),
      mustChangePassword: true,
      roleId: 4, // Assuming the Employee role has ID 4
    },
  });
}

module.exports = { seedRolesAndPermissions };
