if (process.env.NODE_ENV !== "PRODUCTION") require("dotenv").config();
const { RabbitConnection } = require("./connection/amqp");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const hbs = require("hbs");
const app = express();
const PORT = process.env.PORT || 8080;
const ROUTER = require("./router");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.engine("hbs", hbs.__express);
app.set("views", "views");
app.set("view engine", "hbs");
// app.set("view options");
app.use(express.static("public"));
app.use("/", ROUTER);
RabbitConnection.createConnection();
// const conn = RabbitConnection.getInstance();

app.listen(PORT, () => {
    console.log(`🚀 SERVER RUNNING IN PORT ${PORT}`);
});
