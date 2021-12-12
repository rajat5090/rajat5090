//Importing modules
const Product = require(`${__dirname}/../models/productsModel`);
const AppError = require("../utils/appError");

//middlewares
exports.addProduct = async (req, res, next) => {
  try {
    const { name, price, description, quantity } = req.body;
    const userId = req.user.userId;
    const isAdded = await Product.create({ name, price, description, quantity, userId });
    if (!isAdded.dataValues) return next(new AppError(400, "Unable to add product"));
    res.status(200).json({
      status: "success",
      message: "Product added successfully",
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(500, "Unable to add product, something went wrong"));
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    if (products.length == 0)
      return next(new AppError(400, "Unable to get products or no products are added"));
    res.status(200).json({
      status: "Success",
      data: products,
    });
  } catch (err) {
    console.log(err);
    return next(new AppError(500, "Something went wrong"));
  }
};
