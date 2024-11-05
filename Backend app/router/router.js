import express from "express";
import { getProducts, getProductsById, addProduct, updateProduct, deleteProduct } from "../controller/dbcontroller.js";

const router = express.Router();

router.get("/products", getProducts);
router.get("/products/:id", getProductsById);
router.post("/products", addProduct);
router.patch("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct)

export default router;