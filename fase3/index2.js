import express from "express";
import inquirer from "inquirer";
import pg from "pg";


const app = express();
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "northwind",
    password: "dnnasteY",
    port: 5433,
});

db.connect();

let output = [];


const questions = [
    {
        type: 'list',
        name: 'crud',
        message: 'How do you want to edit your database?',
        choices: ['Create', 'Read', 'Update', 'Delete'],
    },
    {
        type: 'list',
        name: 'table',
        message: 'Choose table',
        choices: ['Products', 'Orders', 'Employees', 'Customers'],
        filter(val) {
            return val.toLowerCase()
        }
    },

    {
        type: 'input',
        name: 'info',
        message: 'What [thing] do you wish to delete?'
    }
]


// inquirer.
//     prompt(questions).
//     then(
//         (ans) => {
//             if (ans.crud === 'Read') {
//                 db.query(`SELECT * FROM ${ans.table}`, (err, res) => {
//                     if (err) {
//                         console.log("Error executing query", err.stack)
//                     } else {
//                         output = res.rows
//                         console.log(output)
//                     }
//                 })
//             } else {


//             }
//         })

function handleProd() {
    // CREATE //
    db.query("INSERT INTO products(product_id, product_name, supplier_id, category_id) VALUES ($1, $2, $3, $4)",
        [77, 'Leverpostei', 15, 2],
        (err) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log("suksess")
            }
        })

    // UPDATE //
    db.query("UPDATE products SET product_name = $1 WHERE product_name = $2",
        ['Makrell i tomat', 'Jarlsberg'],
        (err) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log("suksess")
            }
        })
    // DELETE //
    db.query("DELETE FROM order_details WHERE product_id=77; DELETE FROM products WHERE product_id=77;",
        (err) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log("All Good")
            }
        })
}

async function handleOrders() {
    // CREATE //
    const result = await db.query("SELECT MAX(order_id) FROM orders")
    let orderId = result.rows[0].max + 1
    try {
        db.query("INSERT INTO orders(order_id, ship_name, ship_via) VALUES ($1, $2, $3)", [orderId, "La Maison d'Asie", 3])
        try {
            await db.query("INSERT INTO order_details(order_id, product_id, unit_price, quantity, discount) VALUES ($1, $2, $3, $4, $5)", [orderId, 33, 2.5, 10, 0])
        } catch (err) {
            console.log(err)
        }
    } catch (err) {
        console.log(err)
    }
    console.log(orderId)
}

function sgo() { }

