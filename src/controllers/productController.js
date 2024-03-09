const Product = require('../models/Product');

const baseHtml = `
    <!DOCTYPE html>
    <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" type="text/css" href="/style.css">
            <title>Tienda Online jose-sinacento</title>
        </head>
        
        <body>
`;

const getNavBar = () => {
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

// Funciones auxiliares 
const showProducts = async (req, res) => {
    const products = await Product.find();
    const productCards = getProductCards(products);
    const html = baseHtml + getNavBar() + productCards;

    res.send(html);
};

// Genera el HTML de todos los productos
function getProductCards(products, isDashboardPage) {
    let html = '<div class="list-products">';

    for (let product of products) {
        html += getProductCard(product, '', false, isDashboardPage);
    }

    html += '</div>';

    return html;
}

//Función para mostrar solo un producto
function getProductCard(product, className, isDetailPage, isDashboardPage) {
    if (className) {
        return `
            <div class="${className}">
                ${getSingleProductHTML(product, isDetailPage, isDashboardPage)}
            </div>
        `;
    } else {
        return getSingleProductHTML(product, isDetailPage, isDashboardPage);
    }
};

const getSingleProductHTML = (product, isDetailPage, isDashboardPage) => {
    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">

            <div class="text-div">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p>${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}</p>
                <p>${product.category}</p>
                <p>${product.size}</p>

                ${isDetailPage ? '' : getProductDetailLink(product, isDashboardPage)}

                ${isDashboardPage ? getProductActions(product) : ''}
            </div>
        </div>
    `;
}

const getProductDetailLink = (product, isDashboardPage) => {
    return `
        <div class="see-product">
            ${isDashboardPage ? '<a href="/dashboard/' + product._id + '">Ver detalle</a>' : '<a href="/products/' + product._id + '">Ver detalle</a>'}
        </div>
    `;
};

const getProductActions = (product) => {
    return `
        <div class="actions">
            <a href="/dashboard/${product._id}/edit">Editar</a>
            <a href="/dashboard/${product._id}/delete">Eliminar</a>
        </div>
    `;
};

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
            res.send(baseHtml + getNavBar() + getProductCards(products, true) + `<a href="/dashboard/new">Nuevo producto</a>` + htmlEnd);
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: "Error when showing product in dashboard"
            });
        }
    },

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
                    <option value="Camisetas">Camisetas</option>
                    <option value="Pantalones">Pantalones</option>
                    <option value="Zapatos">Zapatos</option>
                    <option value="Accesorios">Accesorios</option>
                </select>
                <select name="size">
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
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

    async showProductDashboard(req, res) {
        try {
            const product = await Product.findById(req.params._id)
            res.send(baseHtml + getNavBar() + getProductCard(product, 'detail-product', true, true) + htmlEnd);
        } catch (error) {
            console.log(error)
            res.status(500).send('search error by product ID')
        }
    },

    async showProductDashboardEdit(req, res) {
        try {
            const productID = req.params._id
            const product = await Product.findById(productID)
            const form = `
                    <h2>Actualizar producto</h2>
                    <div class="formContainer">                
                    <form class="formulario" action="/dashboard/${productID}" method="post">
                        <label for="name">Nombre</label>
                        <input type="text" id="name" name="name"   value="${product.name}">

                        <label for="description">Descripción</label>
                        <input type="text" id="description" name="description"  value="${product.description}">

                        <label for="price">Precio</label>
                        <input type="number" id="price" name="price" value="${product.price}">

                        <label for="image">Imagen</label>
                        <input type="url" id="image" name="image"  value="${product.image}">

                        <div class="formcategory">
                        <p>Categoria:<p>
                            <input type="radio" id="category" name="category" value="Camisetas">
                            <label for="category">Camisetas</label>

                            <input type="radio" id="category" name="category" value="Zapatos">
                            <label for="category">Zapatos</label>

                            <input type="radio" id="category" name="category" value="Pantalones">
                            <label for="category">Pantalones</label>

                            <input type="radio" id="category" name="category" value="Accesorios">
                            <label for="category">Accesorios</label>
                            </div>
                        <div class="formcategory">
                        <p>Tallas:<p>
                            <input type="radio" id="category" name="size" value="XS">
                            <label for="category">XS</label>

                            <input type="radio" id="category" name="size" value="S">
                            <label for="category">S</label>

                            <input type="radio" id="category" name="size" value="M">
                            <label for="category">M</label>

                            <input type="radio" id="category" name="size" value="L">
                            <label for="category">L</label>

                            <input type="radio" id="category" name="size" value="XL">
                            <label for="category">XL</label>
                            </div>
                        <button  class="boton" type="submit">Actualizar</button>
                    </form>
                    </div> 
                `;
            res.send(baseHtml + getNavBar() + form + htmlEnd)
        } catch (error) {
            console.log(error);
        }
    },

    //***API REST***/
    async createProduct(req, res) {
        try {
            const product = await Product.create({ ...req.body })
            res.redirect('/dashboard/' + product.id)
        } catch (error) {
            console.log(error)
        }
    },

    async editProduct(req, res) {
        console.log('he entrado en la edicion');
        try {
            const productID = req.params._id;
            const product = await Product.findByIdAndUpdate(
                productID, {
                ...req.body
            }, { new: true }
            )
            res.redirect('/dashboard/' + product.id)
        } catch (error) {
            console.log(error)
        }
    },

    async deleteProduct(req, res) {
        try {
            const id = req.params._id;
            const product = await Product.findByIdAndDelete(id)
            res.redirect('/dashboard/')
        } catch (error) {
            console.log(error)
        }
    }
};

module.exports = ProductController;
