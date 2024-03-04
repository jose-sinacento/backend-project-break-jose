const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const ProductController = require('../controllers/productController');


router.get('/', ProductController.htmlBasicc);

//Traer todos los productos .find() se trae todos
router.get('/products', ProductController.showProducts);

//Traer solo un producto por su ID
router.get('/products/:_id', ProductController.showProductById);

//Crear nuevos productos
router.post('/products', ProductController.createProduct);

//Actualizar un producto
router.put('/dashboard/:_id', ProductController.showEditProduct);

//Eliminar un producto
router.delete('/dashboard/:_id/delete', ProductController.deleteProduct)

//TODO endpoints dashboard 

module.exports = router;