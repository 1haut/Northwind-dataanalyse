import express from "express";
import { getProducts, getProductsById, addProduct, updateProduct, deleteProduct } from "../controller/prodcontroller.js";
import { getEmployees, getEmployeesById, addEmployee, updateEmployee, deleteEmployee } from "../controller/empcontroller.js";
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from "../controller/custcontroller.js";
import { getOrders, addOrder } from "../controller/ordcontroller.js";

const router = express.Router();

// Routes for products
router.get("/products", getProducts);
router.get("/products/:id", getProductsById);
router.post("/products", addProduct);
router.patch("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct)

// Routes for employees
router.get("/employees", getEmployees);
router.get("/employees/:id", getEmployeesById);
router.post("/employees", addEmployee);
router.patch("/employees/:id", updateEmployee);
router.delete("/employees/:id", deleteEmployee)

// Routes for customers
router.get("/customers", getCustomers)
router.post("/customers", addCustomer)
router.patch("/customers/:id", updateCustomer)
router.delete("/customers/:id", deleteCustomer)

// Route(s) for orders
router.get("/orders", getOrders)
router.post("/orders", addOrder)

export default router;