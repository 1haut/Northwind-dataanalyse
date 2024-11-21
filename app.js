import express from "express"
import pg from "pg";
import bodyParser from "body-parser";
import db from './backend-app/database.js'
import routes from "./backend-app/router/router.js"

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(routes);


app.use(express.static('public'));


// Line Chart Data (e.g., monthly sales)
app.get('/api/line-chart', async (req, res) => {
    try {
        const result = await db.query(`
        SELECT to_char(order_date, 'YYYY-MM') AS month, COUNT(*) AS sales_count
        FROM orders
        GROUP BY month
        ORDER BY month
      `);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Bar Chart Data (e.g., orders per employee)
app.get('/api/bar-chart', async (req, res) => {
    try {
        const result = await db.query(`
        SELECT employees.title_of_courtesy,
            employees.first_name || ' ' || employees.last_name AS full_name,
            COUNT(employees.employee_id) AS number_of_sales
        FROM orders
        JOIN employees
        ON orders.employee_id = employees.employee_id
		WHERE NOT employees.employee_id = 404
        GROUP BY employees.employee_id
        ORDER BY number_of_sales DESC;
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Pie Chart Data (e.g., product categories)
app.get('/api/pie-chart', async (req, res) => {
    try {
        const result = await db.query(`
        SELECT categories.category_name, COUNT(categories.category_id) AS sales_per_category
        FROM products
        JOIN order_details ON products.product_id = order_details.product_id
        JOIN categories ON products.category_id = categories.category_id
        GROUP BY categories.category_id
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get("/api/combo-chart", async (req, res) => {
    try {
        const results = await db.query(`
            SELECT products.product_name, COUNT(products.product_id) AS product_sales, products.units_in_stock
            FROM order_details
            JOIN products
            ON order_details.product_id = products.product_id
            WHERE products.product_id < 100
            GROUP BY products.product_id
            ORDER BY units_in_stock DESC;
            `)
        res.json(results.rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

//
app.get('/api/orders-num', async (req, res) => {
    try {
        const result = await db.query(`
        SELECT COUNT(*) AS orders_num
        FROM orders
        WHERE order_date > '1998-01-01'
      `);
        res.json(result.rows[0].orders_num);  // Return the result as a number
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.get('/api/revenue', async (req, res) => {
    try {
        const results = await db.query(`
            SELECT 
                ROUND(SUM(order_details.unit_price * order_details.quantity * (1 - order_details.discount))::numeric) AS total_rev
            FROM order_details
            JOIN orders
            ON order_details.order_id = orders.order_id
            WHERE orders.order_date > '1998-01-01'
            `)
        res.json(results.rows[0].total_rev)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


app.get('/api/customers', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT COUNT(*) - 1 AS customers
            FROM customers
            `)
        res.json(result.rows[0].customers)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

