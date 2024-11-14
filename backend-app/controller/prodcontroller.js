import db from "../database.js";

let products = []

db.query("SELECT * FROM products", (req, res) => {
    products = res.rows
})

db.query(`
    INSERT INTO products(product_id, product_name)
    SELECT 404, 'test'
    WHERE NOT EXISTS (SELECT product_id FROM products WHERE product_id = 404)`
)

export const getProducts = async (req, res) => {
    try {
        const results = await db.query(`
            SELECT 
                product_id,
                product_name,
                supplier_id,
                category_id,
                quantity_per_unit,
                unit_price,
                units_in_stock
            FROM products
            WHERE NOT product_id = 404
            `)
        res.json(results.rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
}

export const getProductsById = async (req, res) => {
    try {
        const results = await db.query("SELECT * FROM products WHERE product_id = $1", [req.params['id']])
        res.json(results.rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
}

export const addProduct = async (req, res) => {
    try {
        const { product_id, product_name, supplier_id, category_id } = req.body
        await db.query("INSERT INTO products(product_id, product_name, supplier_id, category_id) VALUES ($1, $2, $3, $4)",
            [product_id, product_name, supplier_id, category_id])
        res.json("Product has been added.")
    } catch (err) {
        console.error(err);
        res.json({
            message: err.message,
            detail: err.detail
        })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const product = products.find(prod => prod.product_id === parseInt(req.params.id))
        if (!(product)) {
            return res.json({ error: "No product with this id was found" })
        }
        const productId = req.body.product_id || product.product_id
        const productName = req.body.product_name || product.product_name
        const supplierId = req.body.supplier_id || product.supplier_id
        const categoryId = req.body.category_id || product.category_id

        await db.query("UPDATE products SET product_id = $1, product_name = $2, supplier_id = $3, category_id = $4 WHERE product_id = $5",
            [productId, productName, supplierId, categoryId, req.params.id])
        res.json("Product has been updated.")
    } catch (err) {
        res.json({ message: err.message })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = products.find(prod => prod.product_id === parseInt(req.params.id))
        if (!(product)) {
            return res.json({ error: "No product with this id was found" })
        }
        await db.query("UPDATE order_details SET product_id = 404 WHERE product_id = $1", [req.params.id])
        await db.query("DELETE FROM products WHERE product_id = $1", [req.params.id])
        res.json("Your product has been deleted.")
    } catch (err) {
        console.log(err)
        res.json({ message: err.message, detail: err.detail })
    }
}