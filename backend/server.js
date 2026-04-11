const express = require('express');
const app = express();
const cors = require("cors");
const sequelize = require('./src/db/index');

const userRoutes = require('./src/modules/user/user.routes');
const authRoutes = require('./src/modules/auth/auth.routes');
const authMiddleware = require('./src/middlewares/auth.middleware');
const restaurantRoutes = require('./src/modules/restaurant/restaurant.routes');
const { seedRolesAndPermissions } = require('./src/seed/rolesAndPermissions.seed');

// Import models
const User = require('./src/modules/user/user.model');
const Restaurant = require('./src/modules/restaurant/restaurant.model');
const Role = require('./src/modules/role/role.model');

// Collect models
const models = { User, Restaurant, Role };

// Setup associations
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

app.use(cors({ origin: "*" }));
app.use(express.json()); // Parse JSON bodies

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    // Authenticate database
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    if (process.env.NODE_ENV === 'dev') {
      // Sync all models and associations
      await sequelize.sync({ alter: true });
      console.log('All models and associations were synchronized successfully.');

      // Seed roles and permissions
      await seedRolesAndPermissions();
    }
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

// Start server
startServer();

// Routes
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/restaurants',authMiddleware ,restaurantRoutes);

app.get('/', (req, res) => {
  res.send('Hello World ...sfsf');
});

app.listen(port, () => {
  console.log(`Example app listening on port: http://localhost:${port}`);
});