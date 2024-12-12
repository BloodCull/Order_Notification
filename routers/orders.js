const express = require("express");
const router = express.Router();

const {
  getOrderPage,
  getCreateOrderPage,
  getChangeStatusOrderPage,

  getOrders,
  createOrder,
  changeOrderStatus,
} = require("../controller/orders");

router.get("/orders-page", getOrderPage);
router.get("/create-order-page", getCreateOrderPage);
router.get("/change-order-status-page/:id", getChangeStatusOrderPage);

router.get("/orders", getOrders);
router.post("/orders", createOrder);
router.put("/orders/:id/status", changeOrderStatus);

module.exports = router;
