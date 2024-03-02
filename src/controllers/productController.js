const Product = require('../models/Product');

//TODO >>> html front 
//const baseHtml = 
//const getNavBar =
//const getProductCards = 



const showProducts = async (req, res) => {
    const products = await Product.find();
    const productCards = getProductCards(products);
    const html = baseHtml + getNavBar() + productCards;
    res.send(html);
  };
     

function getProductCards(products) {
    let html = '';
    for (let product of products) {
      html += `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}">
          <h2>${product.name}</h2>
          <p>${product.description}</p>
          <p>${product.price}€</p>
          <a href="/products/${product._id}">Ver detalle</a>
        </div>
      `;
    }
    return html;
  }

const ProductController = {

    async showProducts(req, res) {
        try {
            const products = await Product.find()
            res.json(products)
        } catch (error) {
            console.log(error)
        }
    },

    async showProductById(req, res) {
        try {
            const product = await Product.findById(req.params._id)
            res.json(product)
        } catch (error) {
            console.log(error)
        }
    },
    
    //TODO: GET /dashboard: Devuelve el dashboard del administrador. En el dashboard aparecerán todos los artículos que se hayan subido. Si clickamos en uno de ellos nos llevará a su página para poder actualizarlo o eliminarlo.

    //TODO GET /dashboard/new: Devuelve el formulario para subir un artículo nuevo.showNewProduct

    async createProduct(req, res) {
        try {
            const product = await Product.create({ ...req.body })
            res.status(201).json(product)
        } catch (error) {
            console.log(error)
        }
    },

    //TODO GET /dashboard/:productId: Devuelve el detalle de un producto en el dashboard.

    //TODO GET /dashboard/:productId/edit: Devuelve el formulario para editar un producto. >>> showEditProduct

    async showEditProduct(req, res) {
        try {
            const productID = req.params._id;
            const product = await Product.findByIdAndUpdate(
                productID, {
                ...req.body
            }, { new: true }
            )
            res.json(product)
        } catch (error) {
            console.log(error)
        }
    },

    async deleteProduct(req, res) {
        try {
            const id = req.params._id;
            const product = await Product.findOneAndDelete(id)
            res.json({ mensaje: "product deleted", product })
        } catch (error) {
            console.log(error)
        }
    }
};

module.exports = ProductController;