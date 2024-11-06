import db from "../database.js";

let customers = []

db.query("SELECT * FROM customers", (req, res) => {
    customers = res.rows
})

db.query(`
    INSERT INTO customers(customer_id, company_name)
    SELECT 'BLANK', 'Old Customer'
    WHERE NOT EXISTS (SELECT customer_id FROM customers WHERE customer_id = 'BLANK')`
)

export const getCustomers = async (req, res) => {
    try {
        const results = await db.query("SELECT * FROM customers")
        res.json(results.rows)
    } catch (error) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
}

export const addCustomer = async (req, res) => {
    try {
        const { customer_id, company_name, contact_name, phone, address, city, country } = req.body
        await db.query("INSERT INTO customers(customer_id, company_name, contact_name, phone, address, city, country) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [customer_id, company_name, contact_name, phone, address, city, country])
        res.json("Customer has been added.")
    } catch (err) {
        console.error(err);
        res.json({
            message: err.message,
            detail: err.detail
        })
    }
}

export const updateCustomer = async (req, res) => {
    try {
        const customer = customers[req.params.id - 1]

        if (!(customer)) {
            return res.json({ error: "No customers with this id was found" })
        }
        const customerId = req.body.customer_id || customer.customer_id
        const companyName = req.body.company_name || customer.company_name
        const contactName = req.body.contact_name || customer.contact_name
        const phone = req.body.phone || customer.phone
        const address = req.body.address || customer.address
        const city = req.body.city || customer.city
        const country = req.body.country || customer.country

        await db.query(`
            UPDATE customers 
            SET
                customer_id = $1,
                company_name = $2,
                contact_name = $3,
                phone = $4,
                address = $5,
                city = $6,
                country = $7
            WHERE 
                customer_id = $8
            `,
            [customerId, companyName, contactName, phone, address, city, country, customer.customer_id])
        res.json("Data has been updated.")
    } catch (err) {
        res.status(500).json({ message: err.message, detail: err.detail })
    }
}

export const deleteCustomer = async (req, res) => {
    try {
        const customer = customers[req.params.id - 1]
        if (!(customer)) {
            return res.json({ error: "No customer with this id was found." })
        }
        await db.query("UPDATE orders SET customer_id = 'BLANK' WHERE customer_id = $1", [customer.customer_id])
        await db.query("DELETE FROM customers WHERE customer_id = $1", [customer.customer_id])
        res.json("Customer has been successfully deleted.")
    } catch (err) {
        res.status(500).json({ message: err.message, detail: err.detail })
    }
}