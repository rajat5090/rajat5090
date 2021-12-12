//This file contains routes related to products

//Importing modules
const express = require("express");
const router = express.Router();
const productController = require(`${__dirname}/../controllers/productsController`);
const authController = require(`${__dirname}/../controllers/authController`);

//Defining routes

//add products route
//roles passed in restrict to function only allowed to perform addition of products
router
  .route("/addproduct")
  .post(authController.auth, authController.restrictTo(["tenant"]), productController.addProduct);

//browse all products
router.route("/products").get(productController.getProducts);

//Exporting routes
module.exports = router;
