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

let output = [];
const files = fs.readdirSync('../fase2');

const questions = [
    {
        type: 'list',
        name: 'sql_file',
        message: 'What file do you want to open?',
        choices: files,
        filter(val) {
            return '../fase2/' + val
        }
    },
    {
        type: 'list',
        name: 'format',
        message: 'How do you want to present the results?',
        choices: ['As a JSON-string', 'As a Table'],
    }
]

function setPresentation(choice) {
    if (choice === 'As a JSON-string') {
        console.log(JSON.stringify(output))
    } else {
        console.table(output)
    }
}


inquirer.
    prompt(questions).
    then(
        (ans) => {
            if (ans.sql_file) {
                let sqlQuery = fs.readFileSync(ans.sql_file).toString();

                db.query(sqlQuery, (err, res) => {
                    if (err) {
                        console.log("Error executing query", err.stack)
                    } else {
                        output = res.rows
                        setPresentation(ans.format);
                    }
                })
            } else {
                console.log(ans);
            }
        })

