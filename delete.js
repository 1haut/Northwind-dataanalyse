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

function resArray(obj) {
    let arr = [];
    obj.forEach(element => {
        arr.push(element.table_name || element.column_name)
    });
    return arr
}


async function sgo(query) {
    let arrTables = [];
    let arrColumns = [];
    let currentTable

    // query = "SELECT constraint_name FROM information_schema.constraint_table_usage WHERE table_name = 'suppliers'"
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

    const key = arrColumns[0];
    console.log(key)


}

const text = "DELETE FROM employees WHERE last_name = 'Peacock'"

// sgo(text)
const newText = "DELETE FROM employees WHERE last_name = 'Peacock'"

console.log(
    newText.indexOf("WHERE"))

console.log(newText.slice(22))

console.log(newText.slice(22).split(" "))

console.log(newText.slice(22).split(" ")[1], newText.slice(22).split(" ")[3])
