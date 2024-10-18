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
app.use(express.static("public"));

let output = [];
const files = fs.readdirSync('assets/sql/sql-queries');
console.log(files)

const questions = [
    {
        type: 'input',
        name: 'operation',
        message: 'Insert SQL-query here: '
    },
]

const presentationQ = [
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
                        if (res.command === "SELECT") {
                            inquirer.prompt(presentationQ).then((ans2) => {
                                setPresentation(ans2.format);
                            })
                        };
                        console.log("Your operation was successful.")
                    }
                })
            } else {
                console.log(ans);
            }
        })

