//This file contains routes related to products

//Importing modules
const express = require("express");
const router = express.Router();
const orderController = require(`${__dirname}/../controllers/orderController`);
const authController = require(`${__dirname}/../controllers/authController`);

//Defining routes

//order products route
router.route("/placeorder").post(authController.auth, orderController.placeOrders);

//route for view orders, for uses
router.route("/myorders").get(authController.auth, orderController.viewMyOrders);

//route for view orders, for tenants
router
  .route("/vieworders")
  .get(authController.auth, authController.restrictTo("tenant"), orderController.productOrders);

//Exporting routes
module.exports = router;
