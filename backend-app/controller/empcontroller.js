import db from "../database.js";

let employees = []

db.query("SELECT * FROM employees", (req, res) => {
    employees = res.rows
})

db.query(`
    INSERT INTO employees(employee_id, first_name, last_name)
    SELECT 404, 'Previous', 'Employees'
    WHERE NOT EXISTS (SELECT employee_id FROM employees WHERE employee_id = 404)`
)

export const getEmployees = async (req, res) => {
    try {
        const results = await db.query("SELECT employee_id, first_name, last_name, address, city, home_phone FROM employees WHERE NOT employee_id = 404")
        res.json(results.rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
}

export const getEmployeesById = async (req, res) => {
    try {
        const results = await db.query("SELECT employee_id, first_name, last_name, address, city, home_phone FROM employees WHERE employee_id = $1", [req.params['id']])
        res.json(results.rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
}

export const addEmployee = async (req, res) => {
    try {
        const { employee_id, first_name, last_name, address, city, home_phone } = req.body
        await db.query("INSERT INTO employee(employee_id, first_name, last_name, address, city, home_phone) VALUES ($1, $2, $3, $4, $5, $6)",
            [employee_id, first_name, last_name, address, city, home_phone])
        res.json("Employee has been added.")
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: err.message,
            detail: err.detail
        });
    }
}

export const updateEmployee = async (req, res) => {
    try {
        const employee = employees.find(prod => prod.employee_id === parseInt(req.params.id))
        if (!(employee)) {
            return res.json({ error: "No employee with this id was found" })
        }
        const employeeId = req.body.employee_id || employee.employee_id
        const firstName = req.body.first_name || employee.first_name
        const lastName = req.body.last_name || employee.last_name
        const empAddress = req.body.address || employee.address
        const empCity = req.body.city || employee.city
        const phone = req.body.home_phone || employee.home_phone

        await db.query(`
            UPDATE employees 
            SET
                employee_id = $1,
                first_name = $2,
                last_name = $3,
                address = $4,
                city = $5,
                home_phone = $6
            WHERE 
                employee_id = $7
            `,
            [employeeId, firstName, lastName, empAddress, empCity, phone, req.params.id])
        res.json("Data has been successfully updated.")
    } catch (err) {
        res.json({ message: err.message })
    }
}

export const deleteEmployee = async (req, res) => {
    try {
        await db.query("UPDATE orders SET employee_id = 404 WHERE employee_id = $1", [req.params.id])
        await db.query("DELETE FROM employees WHERE employee_id = $1", [req.params.id])
        res.json("Data has been successfully removed.")
    } catch (error) {
        console.error(err.message);
        res.status(500).json({
            message: err.message,
            detail: err.detail
        });
    }
}