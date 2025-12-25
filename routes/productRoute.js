import express from "express";
import {
  getProduct,
  saveProducts,
  deleteProduct,
  updateProduct,
  getProductById,
} from "../controllers/productController.js";

const productRoute = express.Router()

productRoute.get("/", getProduct);
productRoute.post("/", saveProducts);
productRoute.delete("/:productId", deleteProduct);
productRoute.put("/:productId", updateProduct);
productRoute.get("/:productId", getProductById);

export default productRoute;