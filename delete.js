import express from "express";
import inquirer from "inquirer";
import pg from "pg";
import fs from "fs";

const app = express();
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "northwind",
    password: "dnnasteY",
    port: 5433,
});

db.connect();

db.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
// db.query("INSERT INTO employees(employee_id, first_name, last_name, notes) VALUES(10, 'Previous', 'Employee', '')")

function resArray(obj) {
    let arr = [];
    obj.forEach(element => {
        arr.push(element.table_name || element.column_name || element.constraint_name)
    });
    return arr
}


async function sgo(query) {
    let arrTables = [];
    let arrColumns = [];
    let currentTable

    // db.query(query, (err, res) => {
    //     if (err) {
    //         console.log(err.stack)
    //     } else {
    //         if (res.rowCount === 0) {
    //             console.log("No data was changed.");
    //         } else if (res.command === 'SELECT') {
    //             console.table(res.rows)
    //         }
    //         console.log(res.command, res.rowCount)
    //     }
    // })

    // console.log(query.includes("DELETED"))

    const results = await db.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
    arrTables = resArray(results.rows)

    arrTables.forEach(table => {
        if (query.includes(table)) {
            currentTable = table
        }
    })

    const results2 = await db.query("SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1", [currentTable])
    arrColumns = resArray(results2.rows)
    console.log(arrColumns)

    const keyColumn = arrColumns[0];
    console.log(keyColumn)

    const constraints = await db.query("SELECT constraint_name FROM information_schema.constraint_table_usage WHERE table_name = $1", [currentTable])
    console.log(resArray(constraints.rows))

    const newString = `SELECT ${keyColumn} FROM ${currentTable} ` + query.slice(query.indexOf("WHERE"))
    console.log(newString)

    const queryId = await db.query(`SELECT ${keyColumn} FROM ${currentTable} ` + query.slice(query.indexOf("WHERE")))
    const rowId = queryId.rows[0][keyColumn]
    console.log(rowId)

    let arrTables2 = arrTables.filter(table => table !== currentTable);
    console.log(arrTables2)

    // try {
    //     arrTables2.forEach(table => {
    //         db.query(`UPDATE ${table} SET ${keyColumn} = NULL WHERE ${keyColumn} = ${rowId}`)
    //     })
    // } catch (err) {
    //     console.log(err)
    // }
}

const text = "DELETE FROM employees WHERE last_name = 'Peacock'"

sgo(text)
// const newText = "DELETE FROM employees WHERE last_name = 'Peacock'"

// console.log(
//     newText.indexOf("WHERE"))

// console.log(newText.slice(22))

// console.log(newText.slice(22).split(" "))

// console.log(newText.slice(22).split(" ")[1], newText.slice(22).split(" ")[3])
