const { statuses } = require("../consts/default");
const { orders } = require("../models/orders");
const { transporter, mailOptions } = require("../utils/mail/mail");

const getOrderPage = (req, res) => {
  res.render("orders", { orders });
};

const getOrders = (req, res) => {
  res.json(orders);
};

const getCreateOrderPage = (req, res) => {
  res.render("create-order");
};

const createOrder = (req, res) => {
  const { body } = req;

  if (!body.order_name) {
    res.status(404).json({
      message: "Нет имени заказа",
    });
    return;
  }

  if (!body.author_name) {
    res.status(404).json({
      message: "Нет автора заказа",
    });
    return;
  }
  const order = {
    id: Date.now().toString(),
    name: body.order_name,
    author: body.author_name,
    status: statuses.CREATED,
  };

  orders.push(order);

  transporter.sendMail(
    mailOptions({ toUser: body.author_name }),
    (error, info) => {
      if (error) {
        return console.log("Error", error);
      }

      console.log("Email send successfully:", info.response);
    }
  );

  res.json(order);
};

module.exports = { getOrderPage, getOrders, getCreateOrderPage, createOrder };
