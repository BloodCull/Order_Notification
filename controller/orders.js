const { statuses, statusesRu } = require("../consts/default");
let { orders } = require("../models/orders");
const { transporter, mailOptions } = require("../utils/mail");

const getOrderPage = (req, res) => {
  res.render("orders", {
    orders: orders.filter((order) => order.status !== statuses.DELETED),
  });
};

const getOrders = (req, res) => {
  res.json(orders.filter((order) => order.status !== statuses.DELETED));
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
    mailOptions({
      toUser: body.author_name,
      subject: "Заказ создан",
      text: `Заказ "${order.name}" был создан`,
    }),
    (error, info) => {
      if (error) {
        return console.log("Error", error);
      }

      console.log("Email send successfully:", info.response);
    }
  );

  res.json(order);
};

const getChangeStatusOrderPage = (req, res) => {
  const { params } = req;
  const currentOrder = orders.find((el) => el.id === params.id);
  if (!currentOrder) {
    res.send("Ничего не найдено");
    return;
  }
  res.render("change-status-order", { order: currentOrder, statuses });
};

const changeOrderStatus = (req, res) => {
  const { params, body } = req;

  const currentOrder = orders.find((el) => el.id === params.id);

  if (!currentOrder) {
    res.status(404).json({ message: "Заказ не найден" });
    return;
  }

  orders = orders.map((order) => {
    if (order.id === currentOrder.id) {
      return { ...order, status: body.status };
    }

    return { ...order };
  });

  transporter.sendMail(
    mailOptions({
      toUser: currentOrder.author,
      subject: "Статус заказа был обновлён",
      text: `Статус заказs "${currentOrder.name}" был изменён на "${
        statusesRu[body.status]
      }"`,
    }),
    (error, info) => {
      if (error) {
        return console.log("Error", error);
      }

      console.log("Email send successfully:", info.response);
    }
  );

  res.json({ ...currentOrder, status: body.status });
};

module.exports = {
  getOrderPage,
  getCreateOrderPage,
  getChangeStatusOrderPage,

  getOrders,
  createOrder,
  changeOrderStatus,
};
