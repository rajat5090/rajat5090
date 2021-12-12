const sequelize = require("../DB/sequelize");
const Order = require("../models/ordersModel");
const AppError = require("../utils/appError");
const { QueryTypes, Op } = require("sequelize");
//Importing modules
const Product = require(`${__dirname}/../models/productsModel`);
const User = require(`${__dirname}/../models/usersModel`);

//middlewares

//This middleware is used to place orders
exports.placeOrders = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (productId.length == 0 || quantity.length == 0)
      return next(new AppError(403, "Please select product and quantity"));

    const data = productId.map((el, index) => {
      return { productId: el, quantity: quantity[index], userId: req.user.userId };
    });

    const placedOrder = await Order.bulkCreate(data);
    res.status(200).json({
      status: "Success",
      message: "Your order is placed.",
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

//Using this, user can see their orders.
exports.viewMyOrders = async (req, res, next) => {
  try {
    const myOrders = await Order.findAll({
      include: [{ model: Product }],
      attributes: { exclude: ["productId", "userId"] },
      where: { userId: req.user.userId },
    });
    if (myOrders.length == 0) return next(new AppError(400, "You don't placed any order yet."));

    res.status(200).json({
      status: "Success",
      myOrders,
    });
  } catch (error) {
    return next(new AppError(500, "Something went wrong"));
  }
};

//Using this, tenants can see orders for their products
exports.productOrders = async (req, res, next) => {
  try {
    //getting produtcs ids for specific tenant.
    const data = await sequelize.query(
      `select distinct productId from users,products where products.userId=${req.user.userId}`,
      {
        type: QueryTypes.SELECT,
      }
    );

    const ids = data.map((el) => el.productId);

    const orders = await Order.findAll({
      include: [{ model: Product }, { model: User }],
      attributes: { exclude: ["productId", "userId"] },
      where: { productId: { [Op.or]: [...ids] } },
    });

    res.status(200).json({
      status: "Success",
      orders,
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(500, "Something went wrong"));
  }
};
