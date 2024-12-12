const express = require("express");

const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");

const app = express();
const port = 8080;

app.set("view engine", "ejs");
app.use(express.json());
app.use("/public", express.static(__dirname + "/public"));

const file = fs.readFileSync("./swagger.yaml", "utf8");
const swaggerDocument = YAML.parse(file);
const orderRoutes = require("./routers/orders");
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("", orderRoutes);

app.get("/", (req, res) => {
  res.redirect("/orders");
});

app.listen(port, () => {
  console.log(`Server start on port: ${port}`);
});
