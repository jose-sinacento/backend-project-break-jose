const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const ProductController = require('../controllers/productController');


//Traer todos los productos .find() se trae todos
router.get('/products', ProductController.getAll);

//Traer solo un producto por su ID
router.get('/products/:_id', ProductController.getOneProduct );

//Crear nuevos productos
router.post('/products', ProductController.createNewProduct);

//Actualizar un producto
router.put('/dashboard/:_id', ProductController.updateOneProduct);

//Eliminar un producto
router.delete('/dashboard/:_id/delete', ProductController.deleteOneProduct)

module.exports = router;