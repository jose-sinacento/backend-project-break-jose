const express = require('express');
const Product = require('../models/Product');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.get('/api/products', apiController.showProductsApi);
router.get('/api/products/:_id', apiController.showProductByIdApi)
router.post('/api/products', apiController.createProductApi)
router.put('/api/products/:_id', apiController.updateProductApi)
router.delete('/api/products/:_id/delete', apiController.deleteProductApi)

module.exports = router;