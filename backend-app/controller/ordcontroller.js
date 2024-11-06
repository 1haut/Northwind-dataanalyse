import db from "../database.js";

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