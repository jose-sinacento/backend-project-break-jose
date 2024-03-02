const express = require('express');
const app = express();
const PORT = 3000;
const dbConnection = require('./config/db');
const productRoutes = require('./routes/productRoutes')

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/', productRoutes)

dbConnection()

app.listen(PORT, ()=> {
    console.log(`Express está escuchando en el puerto http://localhost:${PORT}`)
})