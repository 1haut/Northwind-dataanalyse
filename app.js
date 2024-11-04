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
        SELECT employee_id, COUNT(*) AS order_count
        FROM orders
        GROUP BY employee_id
        ORDER BY employee_id
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
        SELECT category_name, COUNT(*) AS product_count
        FROM categories c
        JOIN products p ON c.category_id = p.category_id
        GROUP BY category_name
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

