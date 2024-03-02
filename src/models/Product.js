const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: String, 
    description: String,
    image: String,
    category: String, 
    size: String, 
    price: String
}, {timestamps: true})

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product;