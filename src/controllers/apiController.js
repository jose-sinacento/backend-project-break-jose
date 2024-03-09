const Product = require('../models/Product');

const apiController = {
    async showProductsApi(req, res) {
        try {
        const products = await Product.find();
        res.status(200).json(products);
        } catch(error) {
            console.log(error)
        }
    },

    async showProductByIdApi(req, res) {
        try {
            const product = await Product.findById(req.params._id)
            if(!product){
                return res.status(404).json({message: "Product does not exist"});
            }
            res.json(product);

        } catch(error) {
            console.log(error)
        }
    },

    async createProductApi(req, res) {
        try {
            const product = await Product.create({ ...req.body });
            res.status(200).json({message: "Product succesfully created" + product});
        } catch(error) {
            console.log(error)
        }
    },

    async updateProductApi(req, res) {
        try {
        const product = await Product.findByIdAndUpdate(
            req.params._id, {
            ...req.body
            }, {new: true}
        )
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product successfully updated", product});
        } catch(error) {
            console.log(error)
        }
    },

    async deleteProductApi(req, res) {
        try {
        const product = await Product.findByIdAndDelete(req.params._id)
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted" });
        } catch(error) {
            console.log(error)
        }
    }
}

module.exports = apiController;