const Product = require('../models/Product');

const baseHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" type="text/css" href="/style.css">
        <title>Document</title>
    </head>
    <body>

`;

const getNavBar = function () {
    return `
        <nav id="header">
            <a href="/products">Productos</a>
            <a href="/products/category/camisetas">Camisetas</a>
            <a href="/products/category/pantalones">Pantalones</a>
            <a href="/products/category/zapatos">Zapatos</a>
            <a href="/products/category/accesorios">Accesorios</a>
            <a href="">Login</a>
        </nav>
        <div class="products-box">
    `;
}

const htmlEnd = `
    </div>
    </body>
    </html>
`;

//funciónes auxiliares 
const showProducts = async (req, res) => {
    const products = await Product.find();
    const productCards = getProductCards(products);
    const html = baseHtml + getNavBar() + productCards;
    res.send(html);
};

//función para generar el html de todos los productos
function getProductCards(products, isDashboard) {
    let html = '<div class="list-products">';

    for (let product of products) {
        html += getProductCard(product, '', false, isDashboard);
    }

    html += '</div>';

    return html;
}

//Función para mostrar solo un producto
function getProductCard(product, className, isDetailPage, isDashboard) {
    if (className) {
        return `
            <div class="${className}">
                ${getSingleProductHTML(product, isDetailPage, isDashboard)}
            </div>
        `;
    } else {
        return getSingleProductHTML(product, isDetailPage, isDashboard);
    }
};

const getSingleProductHTML = (product, isDetailPage, isDashboard) => {
    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">

            <div class="text-div">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p>${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}</p>
                <p>${product.category}</p>
                <p>${product.size}</p>

                ${isDetailPage ? '' : getProductDetailLink(product, isDashboard)}
            </div>
        </div>
    `;
}

const getProductDetailLink = (product, isDashboard) => {
    return `
        <div class="see-product">
            ${isDashboard ? '<a href="/dashboard/' + product._id + '">Ver detalle</a>' : '<a href="/products/' + product._id + '">Ver detalle</a>'}
        </div>
    `;
}

//Aquí empiezan los endpoints 
const ProductController = {

    async htmlBasicc(req, res) {
        try {
            const products = await Product.find()
            res.send(baseHtml + getNavBar() + getProductCards(products) + htmlEnd);
        } catch (error) {
            console.log(error)
        }
    },

    async showProducts(req, res) {
        try {
            const products = await Product.find()
            res.send(baseHtml + getNavBar() + getProductCards(products) + htmlEnd);
        } catch (error) {
            console.log(error)
            res.status(500).send('search error of products')
        }
    },
    //TO FIX ****
    async showProductById(req, res) {
        try {
            const product = await Product.findById(req.params._id)
            res.send(baseHtml + getNavBar() + getProductCard(product, 'detail-product', true) + htmlEnd)
        } catch (error) {
            console.log(error)
            res.status(500).send('search error by product ID')
        }
    },

    //TODO: GET /dashboard: Devuelve el dashboard del administrador. En el dashboard aparecerán todos los artículos que se hayan subido. Si clickamos en uno de ellos nos llevará a su página para poder actualizarlo o eliminarlo.

    //TODO GET /dashboard/new: Devuelve el formulario para subir un artículo nuevo.showNewProduct
    async showNewProduct(req, res) {
        try {
            const form = `
                <h2> Crear nuevo producto</h2>
                <div class="formContainer">
                <form class="formulario" action="/dashboard" method="post">
                <label for="name">Nombre</label>
                <input type="text" id="name" name="name" required>
                <label for="description">Descripción</label>
                <input type="text" id="description" name="description" required>
                <label for="price">Precio</label>
                <input type="number" id="price" name="price" required>
                <label for="image">Imagen</label>
                <input type="url" id="image" name="image" required>
                <label for="category">Categoria</label>
                <select name="category">
                    <option value="camisetas">Camisetas</option>
                    <option value="pantalones">Pantalones</option>
                    <option value="zapatos">Zapatos</option>
                    <option value="accesorios">Accesorios</option>
                </select>
                <select name="size">
                    <option value="xs">XS</option>
                    <option value="s">S</option>
                    <option value="m">M</option>
                    <option value="l">L</option>
                    <option value="xl">XL</option>
                </select>
                <br>
                <button class="boton" type="submit">Enviar</button>
                </form>
                </div>
            `;
            res.send(baseHtml + getNavBar() + form + htmlEnd);

        } catch (error) {
            console.log(error)
            res.status(500).send('error creating a new product')
        }
    },

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
    },

    async showProductsByCategory(req, res) {
        let category = req.params.category;
        //Aqui primero pongo en mayúsuclas el char 0 y después concateno lo restante (C-amisetas)
        category = category.charAt(0).toUpperCase() + category.slice(1);
        try {
            let products;
            products = await Product.find({ category: category });
            res.send(baseHtml + getNavBar() + getProductCards(products) + htmlEnd);
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: "Error when filtering products",
                error
            });
        }
    },

    async showProductsDashboard(req, res) {
        try {
            const products = await Product.find()
            res.send(baseHtml + getNavBar() + getProductCards(products, true) + htmlEnd);
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: "Error when showing product in dashboard"
            });
        }
    }
};


module.exports = ProductController;
