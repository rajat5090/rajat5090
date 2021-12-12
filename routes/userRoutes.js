//This file contains routes for the both users and tenant
// using same api both user and tenent can login and signup (for this assignemnet only).

//Importing modules
const express = require("express");
const router = express.Router();
const authController = require(`${__dirname}/../controllers/authController`);

//Defining routes

//signin route
router.route("/signin").post(authController.signIn);

//login route
router.route("/login").post(authController.login);

//Exporting routes
module.exports = router;
