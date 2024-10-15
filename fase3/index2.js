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
let cols = [];
const tables = ["products", "orders", "employees", "customers"]
const strColumns = [
    "product_name, supplier_id, category_id",
    "ship_name, ship_via, product_id, unit_price, quantity, discount",
    "first_name, last_name, title, address, city, country",
    "company_name, contact_name, contact_title, phone, address, city, country"
]
let createReqs = []

const deleteQueries = [
    "DELETE FROM order_details WHERE $1=$2; DELETE FROM products WHERE $1=$2",
    "N/A",
    "ALTER TABLE employees DROP CONSTRAINT pk_employees CASCADE;DELETE FROM employees WHERE $1 = $2;UPDATE orders SET $1 = NULL WHERE $1 = $2;ALTER TABLE IF EXISTS public.employees ADD CONSTRAINT pk_employees PRIMARY KEY (employee_id);ALTER TABLE IF EXISTS public.employees ADD CONSTRAINT fk_employees_employees FOREIGN KEY (reports_to) REFERENCES public.employees (employee_id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION;",
    "DELETE FROM order_details WHERE $1 = $2; DELETE FROM orders WHERE $1 = $2"
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

function setPresentation(choice) {
    if (choice === 'As a JSON-string') {
        console.log(JSON.stringify(output))
    } else {
        console.table(output)
    }
}

async function deleteCheck(x, y) {

}
// Inquirer questions //

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
        name: 'col',
        message: 'Insert the name of the column you want to update: ',
        validate(value) {
            if (!(cols.find(string => string === value))) {
                return "There is no column with the name of: " + value + ", please try again."
            }
            return true
        },
        waitUserInput: true
    },
    {
        type: 'input',
        name: 'row',
        message: 'Insert row you want to update: ',
    },
    {
        type: 'input',
        name: 'valuesProduct',
        message: 'Insert replacement value, separated by comma:',
        validate(values) {
            if (values.split(',').length !== 1) {
                return "You have entered an incorrect amount of values (" + values.split(',').length + "), please try again.";
            }
            return true
        },
        waitUserInput: true
    },
]

const createQuestions = [
    {
        type: 'input',
        name: 'valuesProduct',
        message: 'Insert values for the columns [' + tables + '], separated by comma:' + createReqs,
        validate(values) {
            if (values.split(',').length !== createReqs.split(',').length) {
                return "You have entered an incorrect amount of values (" + values.split(',').length + "), please try again.";
            }
            return true
        },
        waitUserInput: true
    }
]

const deleteQuestions = [
    {
        type: 'input',
        name: 'deleteInfo',
        message: "Please insert row and value in form |row, value|",
    }
]

// Helper-functions //
async function handleProd() {
    // CREATE //
    const result = await db.query("SELECT MAX(product_id) FROM products")
    let prodId = result.rows[0].max + 1

    db.query("INSERT INTO products(product_id, product_name, supplier_id, category_id) VALUES ($1, $2, $3, $4)",
        [prodId, 'Leverpostei', 15, 2],
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

inquirer
    .prompt(baseQuestions)
    .then(
        async (baseAnswers) => {
            if (baseAnswers.crud === 'Read') {
                db.query(`SELECT * FROM ${baseAnswers.table}`, (err, res) => {
                    if (err) {
                        console.log("Error executing query", err.stack)
                    } else {
                        output = res.rows
                        setPresentation(baseAnswers.format);
                    }
                })
            } else if (baseAnswers.crud === 'Update') {
                cols = await updateInfo(baseAnswers.table)
                console.log("These are the columns you can update:")
                console.log(cols)
                inquirer.prompt(updateQuestions)
                    .then(
                        (updateAnswers) => {
                            console.log(baseAnswers, updateAnswers)
                        }
                    )
            } else if (baseAnswers.crud === 'Create') {
                const qIndex = tables.findIndex((table) => table === baseAnswers.table)
                createReqs = strColumns[qIndex]
                inquirer.prompt(createQuestions)
                    .then(
                        (createAnswers) => {
                            console.log(baseAnswers, createAnswers)
                        }
                    )
            }
            else if (baseAnswers.crud === 'Delete') {
                console.log(baseAnswers)
                inquirer.prompt(deleteQuestions)
                    .then(
                        (deleteAnswers) => {
                            console.log(baseAnswers, deleteAnswers)
                        }
                    )
            } else {
                console.log("smth")
            }
        }
    )


function sgo() {

}
