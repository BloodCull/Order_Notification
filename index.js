const express = require("express");
require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");

const orderRoutes = require("./routers/orders");
const { metrics } = require("./utils/metrics");

const app = express();
const port = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(express.json());
app.use("/public", express.static(__dirname + "/public"));

const file = fs.readFileSync("./swagger.yaml", "utf8");
const swaggerDocument = YAML.parse(file);

app.use(
  process.env.SWAGGER_URL,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.use("", orderRoutes);

app.get("/", (req, res) => {
  res.redirect("/orders-page");
});

app.listen(port, () => {
  metrics();
});
