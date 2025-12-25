import express from "express";
import {
  getProduct,
  saveProducts,
  deleteProduct,
} from "../controllers/productController.js";

const productRoute = express.Router()

productRoute.get("/", getProduct);
productRoute.post("/", saveProducts);
productRoute.delete("/:productId", deleteProduct);

export default productRoute;