const express = require('express');
const Product = require('../models/Product');
const ProductController = require('../controllers/productController');

const router = express.Router();

// ******* PARTE PÚBLICA ********
router.get('/', ProductController.htmlBasicc);
// - GET /products: Devuelve todos los productos. Cada producto tendrá un enlace a su página de detalle.
// Traer todos los productos (".find()" se trae todos)
router.get('/products', ProductController.showProducts);
// - GET /products/:productId: Devuelve el detalle de un producto.
// Traer solo un producto por su ID
router.get('/products/:_id', ProductController.showProductById);
// ******* PARTE PÚBLICA ********


// Rutas para los enlaces del navegador
router.get('/products/category/:category', ProductController.showProductsByCategory);


// ******* PARTE PRIVADA ********
// - GET /dashboard: Devuelve el dashboard del administrador. En el dashboard aparecerán todos los artículos que se hayan subido. Si clickamos en uno de ellos nos llevará a su página para poder actualizarlo o eliminarlo.
router.get('/dashboard/', ProductController.showProductsDashboard);

// - GET /dashboard/new: Devuelve el formulario para subir un artículo nuevo.
router.get('/dashboard/new', ProductController.showNewProduct);

// - GET /dashboard/:productId: Devuelve el detalle de un producto en el dashboard
router.get('/dashboard/:_id', ProductController.showProductDashboard);

//- GET /dashboard/:productId/edit: Devuelve el formulario para editar un producto.
router.get('/dashboard/:_id/edit', ProductController.showProductDashboardEdit);


// ******* API REST DASHBOARD ********
// - POST /dashboard: Crea un nuevo producto.
router.post('/dashboard', ProductController.createProduct);

// - PUT /dashboard/:productId: Actualiza un producto.
router.post('/dashboard/:_id', ProductController.editProduct);
// - DELETE /dashboard/:productId/delete: Elimina un producto.
router.get('/dashboard/:_id/delete', ProductController.deleteProduct)


// ******* /API REST ********

module.exports = router;