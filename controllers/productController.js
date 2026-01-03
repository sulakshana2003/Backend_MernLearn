import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function getProduct(req, res) {
  /*  Product.find().then((data)=>{
      res.json(data)  
    }).catch(()=>{
        res.json({
            massage : "Error occured in fetching products"
        })
    })   */

  try {
    const limit = parseInt(req.query.limit) || 0;
    if (isAdmin(req)) {
      const products = await Product.find();
      res.json(products);
    } else {
      const products = await Product.find({ isAvailabe: true });
      if (limit > 0) {
        res.json(products.slice(0, limit));
      } else {
        res.json(products);
      }
    }
  } catch (error) {
    res.json({
      massage: "Error occured in fetching products",
    });
  }
}

export function saveProducts(req, res) {
  if (!isAdmin(req)) {
    res.status(403).json({
      message: "You are not autherize to create products",
    });
    return;
  }

  const product = new Product(req.body);

  product
    .save()
    .then(() => {
      res.json({
        massage: "Product Save Successfully!",
      });
    })
    .catch(() => {
      res.json({
        massage: "Error Occured durring product save",
      });
    });
}

export async function deleteProduct(req, res) {
  //productId = req.params.productId;
  if (!isAdmin(req)) {
    res.status(403).json({
      message: "You are not autherize to delete products",
    });
    return;
  }
  try {
    await Product.deleteOne({ productId: req.params.productId });
    res.json({
      massage: "Product delete successfully",
    });
  } catch (error) {
    res.status(500).json({
      massage: "Error occured durring product delete",
    });
  }
}

export async function updateProduct(req, res) {
  if (!isAdmin(req)) {
    res.status(403).json({
      message: "You are not autherize to update products",
    });
    return;
  }
  const productId = req.params.productId;
  const updatingData = req.body;

  try {
    const product = await Product.updateOne(
      { productId: productId },
      updatingData
    );
    res.json({
      massage: "Product updated successfully",
    });

    if (product == null) {
      res.status(404).json({
        massage: "Product not found",
      });
      return;
    }
    if (product.isAvailabe) {
      res.json(product);
    } else {
      if (!isAdmin(req)) {
        res.status(403).json({
          massage: "Product is not available",
        });
        return;
      }
    }
  } catch (err) {
    res.status(500).json({
      massage: "Internal server error",
    });
  }
}

export async function getProductById(req, res) {
  const productId = req.params.productId;
  try {
    const product = await Product.findOne({ productId: productId });
    res.json(product);
  } catch (error) {
    res.status(500).json({
      massage: "Error occured in fetching product by id",
    });
  }
}
