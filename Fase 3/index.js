import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import fs from "fs"

const app = express();
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "northwind",
    password: "dnnasteY",
    port: 5433,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));

let output = []

let sql = fs.readFileSync("../Fase 2/Varer.sql").toString();

let sqlQuery = sql



db.query(sqlQuery, (err, res) => {
    if (err) {
        console.log("Error executing query", err.stack)
    } else {
        output = res.rows
        console.log(output);
    }
});



