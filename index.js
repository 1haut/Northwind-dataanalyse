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
app.use(express.static("public"));

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

function checkNumber(number) {
    if (number[0])
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
        const result = await db.query(`SELECT MAX(${idColumn}) FROM ${table}`)
        newId = result.rows[0].max + 1
    }

    arrValues = newId + ', ' + arrValues
    arrColumns = idColumn + ', ' + arrColumns

    db.query(`INSERT INTO ${table}(${arrColumns}) VALUES (${arrValues})`,
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
                        waitUserInput: true,
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