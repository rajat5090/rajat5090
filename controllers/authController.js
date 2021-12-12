//This file contains functions/middleware that helps for authentication of users and tenants.

//Importing modules

const jwt = require("jsonwebtoken");
const User = require(`${__dirname}/../models/usersModel`);
const AppError = require("./../utils/appError");
const utility = require(`${__dirname}/../utils/utility`);

//Middlewares

exports.signIn = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    //1. check whether user exist or not.
    const isExist = await User.findOne({ where: { email } });
    if (isExist) return next(new AppError(400, "User already exists"));

    //2. create user
    const customer = await User.create({ name, email, password, confirmPassword, role });

    if (!customer.dataValues) {
      return next(new AppError(400, "Unable to add account"));
    }
    //send token
    utility.createAndSendToken({ id: customer.user_id, email: customer.email }, res);
    res.status(200).json({
      status: "success",
      message: "Account added successfully",
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(500, "Unable to add account, something went wrong"));
  }
};

//login to account
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //1. check whether email and password is present or not
    if (!email || !password) return next(new AppError(400, "Please enter email and password"));

    //2. validate user exist or not
    const isUserExist = await User.scope("withPassword").findOne({ where: { email } });
    if (!isUserExist) return next(new AppError(400, "User not exist"));

    //validate password
    const isCorrect = await utility.isCorrectPassword(isUserExist.password, password);
    if (!isCorrect) return next(new AppError(400, "email or password is invalid"));

    //send token
    utility.createAndSendToken({ id: isUserExist.user_id, email: isUserExist.email }, res);
    res.status(200).json({
      status: "Success",
      message: "Logged in successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.auth = async (req, res, next) => {
  let token;
  //1. check token exist or not
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  //2. If token not exist
  if (!token) return next(new AppError(401, "Please login to get access"));

  //3. Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  //4. Check user exist or not
  const user = await User.findOne({ where: { email: decoded.email } });
  if (!user.dataValues)
    return next(new AppError(400, "User belonging to this token is not exist."));
  req.user = user;
  next();
};

//This function returns a middleware that takes care of roles that are restrict to this operation
exports.restrictTo = (roles) => {
  return async (req, res, next) => {
    if (roles.includes(req.user.role)) next();
    else return next(new AppError(403, "You are not allowed to perform this task"));
  };
};
