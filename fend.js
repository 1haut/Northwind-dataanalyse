import express from "express"
import pg from "pg";
import fs from "fs";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "northwind",
    password: "dnnasteY",
    port: 5433,
});

db.connect();

app.use(express.static('public'));

app.get("/data", async (req, res) => {

    try {
        // Best-selling employee
        const resEmployeeBar = await db.query(`
            SELECT employees.title_of_courtesy, employees.first_name, employees.last_name, COUNT(employees.employee_id) AS number_of_sales
            FROM orders
            JOIN employees
            ON orders.employee_id = employees.employee_id
            GROUP BY employees.employee_id
            ORDER BY number_of_sales DESC;
            `)
        const employeeBar = resEmployeeBar.rows

        // Units in stock
        const resUnitsBar = await db.query(`
            SELECT products.product_id, 
            products.product_name, 
            products.quantity_per_unit, 
            suppliers.company_name AS supplier_name,
            suppliers.country,
            products.units_in_stock
            FROM products
            JOIN suppliers
            ON products.supplier_id = suppliers.supplier_id
            ORDER BY products.units_in_stock 
            `)
        const unitsBar = resUnitsBar.rows

        // Sales per category
        const resCategoryPie = await db.query(`
            SELECT categories.category_name, COUNT(categories.category_id) AS sales_per_category
            FROM products
            JOIN order_details ON products.product_id = order_details.product_id
            JOIN categories ON products.category_id = categories.category_id
            GROUP BY categories.category_id
            `);
        const categoryPie = resCategoryPie.rows;

        // Revenue per supplier
        const resRevenuePie = await db.query(`
            SELECT 
            suppliers.supplier_id, 
            suppliers.company_name,  
            ROUND(
            SUM(order_details.unit_price * order_details.quantity * (1 - order_details.discount))
            ) 
            AS total_sales
            FROM products
            JOIN suppliers ON products.supplier_id = suppliers.supplier_id
            JOIN order_details ON products.product_id = order_details.product_id
            GROUP BY suppliers.supplier_id
            ORDER BY total_sales DESC;
            `)
        const revenuePie = resRevenuePie.rows


        res.json({
            empSalesData: employeeBar,
            categoryData: categoryPie
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Database query error' });
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${3000}`)
})