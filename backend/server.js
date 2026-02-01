const express = require('express')
const app = express()
const cors = require("cors");

app.use(cors({ origin: "http://127.0.0.1:5173" }));

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World!!!')
})

app.listen(port, () => {
  console.log(`Example app listening on port : http://localhost:${port}`)
})
