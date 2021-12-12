// This file contains functions that used as a utility to another fucntions or middlewares

//Importing modules
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Create and send token
exports.createAndSendToken = async (payload, res) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  res.cookie("jwt", token, {
    //secure: true,
    httpOnly: true,
  });
};

//check whether entered password is correct ot not
exports.isCorrectPassword = async (savedPass, currPass) => {
  const isCorrect = await bcrypt.compare(currPass, savedPass);
  return isCorrect;
};
