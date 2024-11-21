# Northwind

The goal of this project is at base educational, to expand my own knowledge in use of SQL, CRUD-operations, handling of data and data analytics. In addition, favorable outcomes rests on the understaning of the interaction between database, app and server.

**Technologies used:**

**Database:** PostgreSQL

**Programming languages:** node.js

**Frameworks:** express.js (Backend), Bootstrap (Frontend)

**Libraries:** npm, jQuery, DataTables, chart.js

**NPM packages:** pg, inquirer

## Usage

(This usage guide assumes that you have installed PostgreSQL and node.js)

1. Follow [this link](https://github.com/pthom/northwind_psql) for instructions on how to download the Northwind database

2. Clone the repository onto your local environment or download this repository
```bash
git clone 1haut/Northwind-dataanalyse
```
3. Install all dependencies
```bash
npm install
```
4. Locate the /backend-app/database.js-file, then populate the fields with the connection information for your own database.
   
```javascript
// Connection information
const db = new pg.Client({
   user: "postgres", // Fill in
   host: "localhost", // Fill in
   database: "northwind", // Fill in
   password: "dnnasteY", // Fill in, password used to access PostgreSQL database
   port: 5433, // Fill in, PostgreSQL usually defaults to port 5432
});

db.connect();
   ```
5. If you want to interact with ...
   - the simple backend app, run the queries.js-file with node.js
     ```bash
     node queries.js
     ```
   - the backend app with CRUD operations, run the main.js-file with node.js, and make API calls to server
     ```bash
     node /backend-app/main.js
     ```
   - a frontend view of the backend app, run the app.js, then open [locahost 3000](http://localhost:3000) for the frontend view
     ```bash
     node app.js
     ```
