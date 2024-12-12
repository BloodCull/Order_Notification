const express = require("express");

const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const app = express();
const port = 8080;

app.set("view engine", "ejs");
app.use(express.json());
app.use("/public", express.static(__dirname + "/public"));

const orderRoutes = require("./routers/orders");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Orders",
      version: "1.0.0",
    },
  },
  apis: ["index.js"],
};

app.use(
  "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(swaggerJsDoc(swaggerOptions))
);

app.use("", orderRoutes);

app.get("/", (req, res) => {
  res.redirect("/orders");
});

app.listen(port, () => {
  console.log(`Server start on port: ${port}`);
});
