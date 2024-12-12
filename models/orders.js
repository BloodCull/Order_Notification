const { statuses } = require("../consts/default");

exports.orders = [
  {
    id: Date.now().toString(),
    name: "Тестовый заказ",
    author: "bloodhomaq@gmail.com",
    status: statuses.IS_PROGRESS,
  },
];
