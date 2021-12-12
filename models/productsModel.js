//Importing modules
const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require(`${__dirname}/../DB/sequelize`);
const User = require("./usersModel");

//Creating model
const Product = sequelize.define(
  "Product",
  {
    productId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    description: {
      type: DataTypes.TEXT,
    },

    // Adding foreign key contraints, so that tenant can see thier products and orders
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "userId",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    },
  },
  {
    defaultScope: {
      attributes: { exclude: ["userId"] },
    },
    withAllAttributes: {
      attributes: {},
    },
  },
  {
    tableName: "Products",
  }
);

User.hasMany(Product);
Product.belongsTo(User, { foreignKey: "userId" });

//Syncronization of model with existing table
(async () => {
  try {
    await Product.sync();
  } catch (err) {
    console.log(err);
  }
})();

module.exports = Product;
