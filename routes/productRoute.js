import express from "express";
import {
  getProduct,
  saveProducts,
  deleteProduct,
  updateProduct,
  getProductById,
  searchProducts,
} from "../controllers/productController.js";

const productRoute = express.Router();

productRoute.get("/", getProduct);
productRoute.post("/add", saveProducts);
productRoute.get("/search", searchProducts);
productRoute.delete("/:productId", deleteProduct);
productRoute.put("/:productId", updateProduct);
productRoute.get("/:productId", getProductById);

export default productRoute;
