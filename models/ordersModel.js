//Importing modules
const { DataTypes } = require("sequelize");
const User = require("./usersModel");
const Product = require("./productsModel");
const sequelize = require(`${__dirname}/../DB/sequelize`);

//Creating model
const Order = sequelize.define(
  "Order",
  {
    orderId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "userId",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "productId",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "orders",
  }
);

//Parent.hasMany(Child, {foreignKey: 'Parent_parentId'})
//Child.belongsTo(Parent, {foreignKey: 'Parent_parentId'})

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

Product.hasMany(Order, { foreignKey: "productId" });
Order.belongsTo(Product, { foreignKey: "productId" });
//Syncronization of model with existing table
(async () => {
  try {
    await Order.sync();
  } catch (err) {
    console.log(err);
  }
})();

module.exports = Order;
