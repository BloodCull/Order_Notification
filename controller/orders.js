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

  res.json({ ...finded });
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

const changeOrdersStatusesBulk = async (req, res) => {
  const { body } = req;

  if (!body.orders) {
    res.status(200).json("Успешно");
    return;
  }

  if (!body.chageStatusTo) {
    res
      .status(404)
      .json("Не передан статус на который требуется изменить заказы");
    return;
  }

  const searchedOrders = orders.filter((item) => body.orders.includes(item.id));

  if (searchedOrders.length === 0) {
    res.status(404).json("Не найдено ни одного заказа");
    return;
  }

  searchedOrders.forEach((item) => {
    item.status = body.chageStatusTo;
  });

  transporter.sendMail(
    mailOptions({
      toUser: searchedOrders[0].author,
      subject: "Статус заказов был обновлён",
      text: `Статус заказов "${searchedOrders
        .map((item) => item.name)
        .join(", ")}" были изменёны на "${statusesRu[body.chageStatusTo]}"`,
    }),
    (error, info) => {
      if (error) {
        return console.log("Error", error);
      }

      console.log("Email send successfully:", info.response);
    }
  );

  res.json("Крутышка");
};

module.exports = {
  getOrderPage,
  getCreateOrderPage,
  getChangeStatusOrderPage,
  changeOrdersStatusesBulk,

  getOrders,
  createOrder,
  changeOrderStatus,
  getOrderById,
};
