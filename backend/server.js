const express = require('express')
const app = express()
const cors = require("cors");
const sequelize = require('./src/db/index');
const userRoutes = require('./src/modules/user/user.routes');
const authRoutes = require('./src/modules/auth/auth.routes');
const authMiddleware = require('./src/middlewares/auth.middleware');
const checkIfAdmin = require('./src/middlewares/role.middlewares');
const restaurantRoutes = require('./src/modules/restaurant/restaurant.routes');
const { seedRolesAndPermissions } = require('./src/seed/rolesAndPermissions.seed');

app.use(cors({ origin: "http://127.0.0.1:5173" }));

const port = process.env.PORT || 3000

app.use(express.json()); // Parse JSON bodies
async function startServer (){
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    if (process.env.NODE_ENV === 'dev'){
      await sequelize.sync({ alter: true });

      console.log('All models were synchronized successfully.'); 
      await seedRolesAndPermissions();
    }
  }
  catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer();

app.use('/api/users',authMiddleware,checkIfAdmin, userRoutes );
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!!!')
})


app.listen(port, () => {
  console.log(`Example app listening on port : http://localhost:${port}`)
})
