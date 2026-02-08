const express = require('express')
const app = express()
const cors = require("cors");
const sequelize = require('./src/db/index');
const userRoutes = require('./src/modules/user/user.routes');
const authRoutes = require('./src/modules/auth/auth.routes');
const authMiddleware = require('./src/modules/auth/auth.middleware');

app.use(cors({ origin: "http://127.0.0.1:5173" }));

const port = process.env.PORT || 3000

app.use(express.json()); // Parse JSON bodies
async function startServer (){
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    if (process.env.NODE_ENV === 'dev'){
      await sequelize.sync({ force: false});

      console.log('All models were synchronized successfully.'); 
    }
  }
  catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer();

app.use('/api/users',authMiddleware, userRoutes );
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!!!')
})


app.listen(port, () => {
  console.log(`Example app listening on port : http://localhost:${port}`)
})
