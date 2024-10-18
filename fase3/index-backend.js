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
let createReqs = [];
const tables = ["products", "orders", "employees", "customers"]
const strColumns = [
    "product_name, supplier_id, category_id",
    "ship_name, ship_via, product_id, unit_price, quantity, discount",
    "first_name, last_name, title, address, city, country",
    "company_name, contact_name, contact_title, phone, address, city, country"
]


const deleteQueries = [
    "DELETE FROM order_details WHERE order_id=$2; DELETE FROM products WHERE product_id=$2",
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

function queryUpdate(table, col, oldValue, newValue) {
    db.query(`UPDATE ${table} SET ${col} = $1 WHERE ${col} = $2`, [newValue, oldValue],
        (err, res) => {
            if (err) {
                console.log(err.stack)
            } else if (res.rowCount < 1) {
                console.log("No data changed.")
            } else {
                console.log("Your values have been successfuly updated.")
            }
        }
    )
}

async function queryCreate(table, columns, values) {
    let arrValues = values.split(',')
    let arrColumns = columns.split(',')
    const idColumn = table.slice(0, -1) + '_id'
    let newId

    if (table === 'customers') {
        const businessName = arrValues[0]
        newId = businessName.replace(/\s+/g, '').slice(0, 5).toUpperCase()
    } else {
        const result = await db.query("SELECT MAX(product_id) FROM products")
        newId = result.rows[0].max + 1
    }

    arrValues = newId + ', ' + arrValues
    arrColumns = idColumn + ', ' + arrColumns
    arrValues = arrValues.split(',')

    console.log(arrValues + '\n' + arrColumns)
    console.log(typeof (arrValues))

    db.query(`INSERT INTO ${table}(${arrColumns}) VALUES ($1)`, [arrValues],
        (err) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log("Your values have been successfully created.")
            }
        })
}

function queryDelete(table, col, value) {

    db.query(`DELETE FROM ${table} WHERE ${col} = ${value}`,
        (err) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log("Your values have been successfully deleted.")
            }
        }
    )
}


// Helpers v2 //
async function handleCreate() {
    // products //
    const r1 = db.query("SELECT MAX(product_id) FROM products")
    let prodId = r1.rows[0].max + 1

    db.query("INSERT INTO products(product_id, product_name, supplier_id, category_id) VALUES ($1, $2, $3, $4)",
        [prodId, 'Leverpostei', 15, 2],
        (err) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log("suksess")
            }
        })
    // orders //
    const r2 = await db.query("SELECT MAX(order_id) FROM orders")
    let orderId = r2.rows[0].max + 1
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
    // employees //
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
    // customers //
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
}

function handleDelete() {
    // orders //
    db.query("DELETE FROM order_details WHERE product_id=77; DELETE FROM products WHERE product_id=77;",
        (err) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log("All Good")
            }
        })
    // customers //
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
                        console.log(JSON.stringify(output))
                    }
                })
            } else if (baseAnswers.crud === 'Update' && baseAnswers.table !== 'orders') {
                cols = await updateInfo(baseAnswers.table)
                console.log("These are the columns you can update:")
                console.log(cols)
                inquirer.prompt(
                    [
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
                            name: 'oldValue',
                            message: 'Insert row you want to update: ',
                        },
                        {
                            type: 'input',
                            name: 'newValue',
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
                )
                    .then(
                        (updateAnswers) => {
                            console.log(baseAnswers, updateAnswers)
                            queryUpdate(baseAnswers.table, updateAnswers.col, updateAnswers.oldValue, updateAnswers.newValue)
                        }
                    )
            } else if (baseAnswers.crud === 'Create') {
                const qIndex = tables.findIndex((table) => table === baseAnswers.table)
                createReqs = strColumns[qIndex]
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'values',
                        message: 'Insert values for the columns [ ' + createReqs + ' ], separated by comma:',
                        validate(values) {
                            if (values.split(',').length !== createReqs.split(',').length) {
                                return "You have entered an incorrect amount of values (" + values.split(',').length + "), please try again.";
                            }
                            return true
                        },
                        waitUserInput: true
                    }
                ]
                )
                    .then(
                        (createAnswers) => {
                            queryCreate(baseAnswers.table, createReqs, createAnswers.values)
                            console.log(baseAnswers, createAnswers)
                        }
                    )
            }
            else if (baseAnswers.crud === 'Delete' && baseAnswers.table !== 'orders') {
                console.log(baseAnswers)
                inquirer.prompt(
                    [
                        {
                            type: 'input',
                            name: 'deleteInfo',
                            message: "Please insert row and value you would like to delete, separated by comma: ",
                            validate(values) {
                                if (values.split(',').length !== 2) {
                                    return "You have entered an incorrect amount of values (" + values.split(',').length + "), please try again.";
                                }
                                return true
                            },
                            waitUserInput: true
                        }
                    ]
                )
                    .then(
                        (deleteAnswers) => {
                            console.log(baseAnswers, deleteAnswers)
                        }
                    )
            } else {
                console.log("Updating or deleting orders is not permissable, please try again.")
            }
        }
    )
