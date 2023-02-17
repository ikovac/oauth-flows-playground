require("dotenv").config();

const express = require("express");
const cors = require("cors");
const spaImplicit = require("./flows/spa_implicit");
const spaPkce = require("./flows/spa_pkce");
const regularImplicit = require("./flows/regular_web_app_implicit");

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors());

app.use(spaImplicit.route, spaImplicit.router);
app.use(spaPkce.route, spaPkce.router);
app.use(regularImplicit.route, regularImplicit.router);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
