require("dotenv").config(); // load env variables from .env file
const express = require("express"); // import express
const morgan = require("morgan"); // ghi log request
const helmet = require("helmet"); // bảo mật cho ứng dụng express
const compression = require("compression"); // nén response
const app = express(); // khởi tạo express app

// init middleware
// Sử dụng format combined cho production
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined")); // combined is the Apache style output
} else {
  app.use(morgan("dev")); // dev is the default format
}

app.use(helmet());
app.use(compression());
app.use(express.json()); // parse json request body
app.use(express.urlencoded({ extended: true })); // parse urlencoded request body

// init db
require("./dbs/init.mongodb.js"); // khởi tạo mongodb connection

// init routes
app.use("", require("./routes/index.js")); // import routes from index.js file

// handling error

module.exports = app;
