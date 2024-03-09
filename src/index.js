const express = require('express');
const app = express();
const PORT = 3000;
const dbConnection = require('./config/db');
const productRoutes = require('./routes/productRoutes')
const authRoutes = require('./routes/productRoutes');
const hashedSecret = require('./config/crypto');
const session = require('express-session');

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(
    session({
        secret: hashedSecret,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    })
)
app.use('/', productRoutes)
app.use('/', authRoutes)

dbConnection()

//Para poder añadir estilos, imágenes, etc. necesitaremos el middleware express.static para servir archivos estáticos.
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Express está escuchando en el puerto http://localhost:${PORT}`)
})