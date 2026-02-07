const express = require('express')
const app = express()
const cors = require("cors");
const sequelize = require('./src/db/index');

app.use(cors({ origin: "http://127.0.0.1:5173" }));

const port = process.env.PORT || 3000


async function startServer (){
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    if (process.env.NODE_ENV === 'dev'){
      await sequelize.sync({ force: true });
      console.log('All models were synchronized successfully.'); 
    }
  }
  catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer();

app.get('/', (req, res) => {
  res.send('Hello World!!!')
})

app.listen(port, () => {
  console.log(`Example app listening on port : http://localhost:${port}`)
})
