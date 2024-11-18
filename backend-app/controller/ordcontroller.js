import db from "../database.js";

export const getOrders = async (req, res) => {
    try {
        const results = await db.query(`
            SELECT 
                orders.order_id, 
                orders.customer_id, 
                orders.employee_id, 
                orders.ship_via, 
                order_details.product_id
            FROM orders
            JOIN order_details
            ON orders.order_id = order_details.order_id
            `)
        res.json(results.rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: err.message,
            detail: err.detail
        });
    }
}

export const addOrder = async (req, res) => {
    try {
        const { order_id, customer_id, employee_id, ship_via, product_id } = req.body
        await db.query("INSERT INTO orders(order_id, customer_id, employee_id, ship_via) VALUES ($1, $2, $3, $4)",
            [order_id, customer_id, employee_id, ship_via])
        await db.query("INSERT INTO order_details(order_id, product_id) VALUES ($1, $2)", [order_id, product_id])
        res.json("Your order has been added.")
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: err.message,
            detail: err.detail
        });
    }
}