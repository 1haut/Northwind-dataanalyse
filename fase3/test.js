// import inquirer from 'inquirer';

// inquirer
//     .prompt([
//         {
//             type: 'list',
//             name: 'theme',
//             message: 'What do you want to do?',
//             choices: [
//                 'Order a pizza',
//                 'Make a reservation',
//                 new inquirer.Separator(),
//                 'Ask for opening hours',
//                 {
//                     name: 'Contact support',
//                     disabled: 'Unavailable at this time',
//                 },
//                 'Talk to the receptionist',
//             ],
//         },
//         {
//             type: 'list',
//             name: 'size',
//             message: 'What size do you need?',
//             choices: ['Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro'],
//             filter(val) {
//                 return val.toLowerCase();
//             },
//         },
//     ])
//     .then((answers) => {
//         console.log(JSON.stringify(answers, null, '  '));
//     });

import express from "express";
import inquirer from "inquirer";
import pg from "pg";
import fs from "fs";

// const app = express();
// const db = new pg.Client({
//     user: "postgres",
//     host: "localhost",
//     database: "northwind",
//     password: "dnnasteY",
//     port: 5433,
// });

// db.connect();


// db.query("SELECT * FROM shippers", (err, res) => {
//     if (err) {
//         console.log("Error executing query", err.stack)
//     } else {
//         let output = res.rows
//         console.table(output);
//     }
// })

// const array = [{ myId: 42, name: 'John', color: 'red' }, { myId: 1337, name: 'Jane', color: 'blue' }]

// const transformed = array.reduce((acc, { myId, ...x }) => { acc[myId] = x; return acc }, {})

// console.table(transformed)

inquirer
    .prompt([
        {
            type: 'checkbox',
            message: 'Select toppings',
            name: 'toppings',
            choices: [
                new inquirer.Separator(' = The Meats = '),
                {
                    name: 'Pepperoni',
                },
                {
                    name: 'Ham',
                },
                {
                    name: 'Ground Meat',
                },
                {
                    name: 'Bacon',
                },
                new inquirer.Separator(' = The Cheeses = '),
                {
                    name: 'Mozzarella',
                    checked: true,
                },
                {
                    name: 'Cheddar',
                },
                {
                    name: 'Parmesan',
                },
                new inquirer.Separator(' = The usual ='),
                {
                    name: 'Mushroom',
                },
                {
                    name: 'Tomato',
                },
                new inquirer.Separator(' = The extras = '),
                {
                    name: 'Pineapple',
                },
                {
                    name: 'Olives',
                    disabled: 'out of stock',
                },
                {
                    name: 'Extra cheese',
                },
            ],
            validate(answer) {
                if (answer.length === 0) {
                    return 'You must choose at least one topping.';
                }

                return true;
            },
        },
    ])
    .then((answers) => {
        console.log(JSON.stringify(answers, null, '  '));
    });