const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
const port = 8080;

app.set("view engine", "ejs");
app.use(express.json());
app.use("/public", express.static(__dirname + "/public"));

const emailUser = "culllalka@gmail.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: "kcvv kmir eriy cbbr",
  },
});

const mailOptions = ({ toUser, subject, text, html }) => {
  return {
    from: emailUser,
    to: toUser,
    subject,
    text,
    html,
  };
};

const statuses = {
  CREATED: "created",
  IS_PROGRESS: "in_progress",
  FINISHED: "finished",
};

const orders = [];

app.get("/", (req, res) => {
  res.render("orders", { orders });
});

app.get("/create_order", (req, res) => {
  res.render("create-order");
});

app.post("/create_order", (req, res) => {
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
});

app.listen(port, () => {
  console.log(`Server start on port: ${port}`);
});
