import e from "express";
import Order from "../models/order.js";
import Product from "../models/product.js";

export async function createOrder(req, res) {
  //get user info from token
  //add current users name if not provided
  //orderId genarate
  //check stock
  //create order object

  if (req.user == null) {
    res.status(403).json({
      massage: "You are not able to create order . please login first",
    });
    return;
  }

  const orderInfo = req.body;
  if (orderInfo.name == null) {
    orderInfo.name = req.user.firstname + " " + req.user.lastname;
  }

  let orderId = "cbc00001";
  // adu eke idn wadi ekt 1 date : 1
  // wadi eke idn adu ekt -1 date : -1

  const lastOrder = await Order.find().sort({ _id: -1 }).limit(1);
  if (lastOrder.length > 0) {
    const lastOrderId = lastOrder[0].orderId;
    const numericPart = parseInt(lastOrderId.replace("cbc", ""));
    const newNumericPart = numericPart + 1;
    orderId = "cbc" + String(newNumericPart).padStart(5, "0");
  }

  try {
    let total = 0;
    let labledtotal = 0;
    const products = [];

    for (let i = 0; i < orderInfo.products.length; i++) {
      const item = await Product.findOne({
        productId: orderInfo.products[i].productId,
      });
      if (item == null) {
        res.status(404).json({
          massage: `Product with id ${orderInfo.products[i].productId} not found`,
        });
        return;
      }

      if (!item.isAvailabe || item.stock < orderInfo.products[i].quantity) {
        res.status(400).json({
          massage: `Product with id ${orderInfo.products[i].productId} is not available in the requested quantity`,
        });
        return;
      }

      products[i] = {
        productInfo: {
          productId: item.productId,
          name: item.name,
          price: item.price,
          labledprice: item.labledprice,
          image: item.image,
          altnames: item.altnames,
          description: item.description || "",
        },
        quantity: orderInfo.products[i].quantity,
      };

      total += item.price * orderInfo.products[i].quantity;
      labledtotal += item.labledprice * orderInfo.products[i].quantity;
    }

    const order = new Order({
      orderId: orderId,
      email: req.user.email,
      name: orderInfo.name,
      phone: orderInfo.phone,
      address: orderInfo.address,
      products: products,
      total: total,
      labledTotal: labledtotal,
    });
    const createdOrder = await order.save();
    res.json({
      massage: "Order created successfully",
      order: createdOrder,
    });
  } catch (err) {
    res.status(500).json({
      massage: "Error occured in creating order",
      error: err,
    });
  }
}

export async function getOrders(req, res) {
  if (req.user == null) {
    res.status(403).json({
      massage: "You are not able to view orders. please login first",
    });
    return;
  }
  try {
    if (req.user.role == "admin") {
      const orders = await Order.find();
      res.json(orders);
    } else {
      const orders = await Order.find({ email: req.user.email });
      res.json(orders);
    }
  } catch (err) {
    res.status(500).json({
      massage: "Error occured in fetching orders",
      error: err,
    });
  }
}

export async function updateOrderStatus(req, res) {
  if (req.user == null || req.user.role !== "admin") {
    res.status(403).json({
      massage: "You are not authorized to update order status",
    });
    return;
  }

  const status = req.body.status;
  const orderId = req.params.orderId;

  try {
    const order = await Order.findOne({ orderId: orderId });
    if (!order) {
      res.status(404).json({
        massage: `Order with id ${orderId} not found`,
      });
      return;
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.json({
      massage: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (err) {
    res.status(500).json({
      massage: "Error occured in updating order status",
      error: err,
    });
  }
}
