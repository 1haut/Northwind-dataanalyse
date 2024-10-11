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

const baseQuestions = [
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
]

async function updateInfo(tableName) {
    try {
        const results = await db.query("SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1", [tableName])
        let columns = []
        results.rows.forEach((column) => {
            columns.push(column.column_name)
        });
        return columns
    } catch (err) {
        console.log(err)
    }
}

updateInfo('products')

let cols = []

const readQuestion = [
    {
        type: 'list',
        name: 'format',
        message: 'How do you want to present the results?',
        choices: ['As a JSON-string', 'As a Table'],
    }
]

const updateQuestions = [
    {
        type: 'input',
        name: 'nameThing',
        message: 'Which things would you like to update?'
    },
    {
        type: 'list',
        name: 'col',
        message: 'Select columns to update: ',
        choices: cols
    },
    {
        type: 'input',
        name: 'valuesProduct',
        message: 'Insert values, separated by comma:',
        validate(values) {
            if (values.split(',').length !== cols.length) {
                return "You have entered an incorrect amount of values, (" + values.split(',').length + "), please try again.";
            }
            return true
        },
        waitUserInput: true
    },
]

const createQuestions = [
    {
        type: 'input',
        name: 'col',
        message: 'Select columns to create: ',
        choice: cols
    },
    {
        type: 'input',
        name: 'valuesProduct',
        message: 'Insert values, separated by comma:',
        validate(values) {
            if (values.split(',').length !== cols.length) {
                return "You have entered an incorrect amount of values, (" + values.split(',').length + "), please try again.";
            }
            return true
        },
        waitUserInput: true
    },
]

function setPresentation(choice) {
    if (choice === 'As a JSON-string') {
        console.log(JSON.stringify(output))
    } else {
        console.table(output)
    }
}

// inquirer
//     .prompt(baseQuestions)
//     .then(
//         (baseAnswers) => {
//             if (baseAnswers.crud === 'read') {
//                 db.query(`SELECT * FROM ${baseAnswers.table}`, (err, res) => {
//                     if (err) {
//                         console.log("Error executing query", err.stack)
//                     } else {
//                         output = res.rows
//                         setPresentation(baseAnswers.format);
//                     }
//                 })
//             } else {
//                 inquirer.prompt(newQuestions)
//                     .then(
//                         (ans2) => {
//                             console.log(ans2)
//                         }
//                     )
//                 console.log(typeof (baseAnswers.crud))
//             }
//         }
//     )

const newQuestions = [
    {
        type: 'input',
        name: 'text',
        message: 'Write something here, for the purpose of testing my ability to nest: '
    }
]

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

async function handleEmp() {
    // CREATE //
    const result = await db.query("SELECT MAX(employee_id) FROM employees")
    let employeeId = result.rows[0].max + 1

    console.log(employeeId)

    db.query("INSERT INTO employees (employee_id, last_name, first_name, title, address, city, country) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [employeeId, 'Thornell', 'Guy', 'Inside Sales Coordinator', '3522 Hillcrest Drive', 'Tacoma', 'USA'],
        (err) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log("suksess")
            }
        })

    // UPDATE //
    db.query("UPDATE employees SET first_name = $1 WHERE last_name = $2",
        ['Garrett', 'Thornell'],
        (err, res) => {
            if (err) {
                console.log(err.stack)
            } else if (res.rowCount < 1) {
                console.log("No data changed.")
            } else {
                console.log("Good")
            }
        })
    // DELETE //

}
function handleCust() {
    // CREATE //
    let businessName = "Sunshine Valley Retreat Center"
    let businessId = businessName.replace(/\s+/g, '').slice(0, 5).toUpperCase()

    console.log(businessId, businessName)

    db.query("INSERT INTO customers (customer_id, company_name, contact_name, contact_title, phone, address, city, country) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [businessId, businessName, 'Sarah Thompson', 'Purchasing Manager', '(209) 244-0076', '1234 Meadow Lane', 'Pine Grove', 'USA'],
        (err) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log("suksess")
            }
        })
    // UPDATE //
    db.query("UPDATE customers SET contact_name = $1 WHERE company_name = $2",
        ['Zbyszek Piestrzeniewicz', 'Wolski  Zajazd'],
        // UPDATE, gir ikke feil hvis ingen navn oppfyller kriteriene //
        (err, res) => {
            if (err) {
                console.log(err.stack)
            }
            else if (res.rowCount < 1) {
                console.log("No data changed.")
            } else {
                console.log("Good")
            }
        })
    // DELETE //
    let orderId = 10249
    db.query(`DELETE FROM order_details WHERE order_id = ${orderId}; DELETE FROM orders WHERE order_id = ${orderId};`,
        (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log("DELETED")
            }
        })
}

function sgo() {

}
