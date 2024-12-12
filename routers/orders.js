const express = require("express");
const router = express.Router();

const {
  getOrderPage,
  getCreateOrderPage,
  getOrders,
  createOrder,
} = require("../controller/orders");

router.get("/orders-page", getOrderPage);
router.get("/orders", getOrders);

router.get("/create_order", getCreateOrderPage);
router.post("/create_order", createOrder);

module.exports = router;
