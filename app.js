//Importing Modules
const express = require("express");
const app = express();
const userRoutes = require(`${__dirname}/routes/userRoutes`);
const productRoutes = require(`${__dirname}/routes/productRoutes`);
const orderRoutes = require(`${__dirname}/routes/orderRoutes`);
const globalErrorHandler = require(`${__dirname}/utils/globalErrorHandler`);

//Middlewares
app.use(express.json());
app.use(userRoutes);
app.use(productRoutes);
app.use(orderRoutes);
app.use(globalErrorHandler);

app.use("*", (req, res, next) => {
  res.send("page not found");
});

//Exporting module
module.exports = app;
