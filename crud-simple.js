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

const questions = [
    {
        type: 'input',
        name: 'operation',
        message: 'Insert valid SQL-query here: '
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

db.query("ALTER TABLE products ALTER COLUMN discontinued DROP NOT NULL")


inquirer.
    prompt(questions).
    then(
        (ans) => {
            // db.query(ans.operation, (err, res) => {
            //     if (err) {
            //         console.log("Error executing query", err.stack)
            //     } else {
            //         output = res.rows
            //         if (res.rowCount && res.rowCount === 0) {
            //             console.log("No data was changed.")
            //         }
            //         else if (res.command === "SELECT") {
            //             inquirer.prompt(presentationQ).then((ans2) => {
            //                 setPresentation(ans2.format);
            //             })
            //         };
            //         console.log("Your operation was successful.")
            //     }
            // })
            // try {
            //     db.query(ans.operation, res => {
            //         output = res.rows;
            //         if (res.rowCount && res.rowCount === 0) {
            //             console.log("No data was changed.");
            //         }
            //         else if (res.command === "SELECT") {
            //             inquirer.prompt(presentationQ).then((ans2) => {
            //                 setPresentation(ans2.format);
            //             })
            //         }
            //     })
            // } catch (err) {
            //     console.log("Error executing query", err.stack)
            // }
            db.query(ans.operation, (err, res) => {
                if (err) {
                    console.log(err.stack)
                } else {
                    output = res.rows
                    if (res.rowCount === 0) {
                        console.log("No data was changed.");
                    }
                    else if (res.command === "SELECT") {
                        inquirer.prompt(presentationQ).then((ans2) => {
                            setPresentation(ans2.format);
                        })
                    }
                    console.log(res)
                }
            })
        })

