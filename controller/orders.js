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

const getOrderById = async (req, res) => {
  const { params } = req;
  const finded = orders.find((item) => item.id === params.id);

  if (!finded) return res.status(404).json({ message: "Заказ не найден" });

  const result = await fetch(
    `${process.env.COMMENTS_APPLICATION}/order-comment?orderId=${finded.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const resJSON = await result.json();

  res.json({ ...finded, comments: resJSON });
};

const getCreateOrderPage = (req, res) => {
  res.render("create-order");
};

const createOrder = async (req, res) => {
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

  await fetch(`${process.env.HISTORY_APPLICATION}/history-item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      originalResource: {
        name: "order",
        otherPathForGetCurrentObject: `/orders/${order.id}`,
        method: "GET",
        url: `${req.protocol}://${req.headers.host}`,
      },
      after: JSON.stringify(order),
    }),
  });

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

const changeOrderStatus = async (req, res) => {
  const { params, body } = req;

  const currentOrder = orders.find((el) => el.id === params.id);

  if (!currentOrder) {
    res.status(404).json({ message: "Заказ не найден" });
    return;
  }

  const modifiedOrder = { ...currentOrder, status: body.status };

  await fetch(`${process.env.HISTORY_APPLICATION}/history-item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      originalResource: {
        name: "order",
        otherPathForGetCurrentObject: `/orders/${currentOrder.id}`,
        method: "GET",
        url: `${req.protocol}://${req.headers.host}`,
      },
      after: JSON.stringify(modifiedOrder),
    }),
  });

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

  res.json(modifiedOrder);
};

module.exports = {
  getOrderPage,
  getCreateOrderPage,
  getChangeStatusOrderPage,

  getOrders,
  createOrder,
  changeOrderStatus,
  getOrderById,
};
