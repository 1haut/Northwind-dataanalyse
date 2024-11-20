import db from "../database.js";

let products = []

async function setupQueries() {
    db.query("SELECT * FROM products", (req, res) => {
        products = res.rows
    })

    await db.query(`
        ALTER TABLE products ALTER COLUMN discontinued DROP NOT NULL
        `)


    await db.query(`
        INSERT INTO products(product_id, product_name)
        SELECT 404, 'No product'
        WHERE NOT EXISTS (SELECT product_id FROM products WHERE product_id = 404)`
    )
}


export const getProducts = async (req, res) => {
    try {
        await setupQueries()

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
        const { product_id, product_name, supplier_id, category_id, quantity_per_unit, unit_price, units_in_stock } = req.body
        await db.query("INSERT INTO products(product_id, product_name, supplier_id, category_id, quantity_per_unit, unit_price, units_in_stock) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [product_id, product_name, supplier_id, category_id, quantity_per_unit, unit_price, units_in_stock])
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
        const quantityPerUnit = req.body.quantity_per_unit || product.quantity_per_unit
        const unitPrice = req.body.unit_price || product.unit_price
        const unitsInStock = req.body.units_in_stock || product.units_in_stock

        await db.query(`
            UPDATE products 
            SET product_id = $1, 
                product_name = $2, 
                supplier_id = $3, 
                category_id = $4,
                quantity_per_unit = $5,
                unit_price = $6,
                units_in_stock = $7
            WHERE product_id = $8
            `,
            [productId, productName, supplierId, categoryId, quantityPerUnit, unitPrice, unitsInStock, req.params.id])
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
        res.json({
            message: err.message,
            detail: err.detail
        })
    }
}