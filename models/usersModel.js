//Importing modules
const { DataTypes } = require("sequelize");
const sequelize = require(`${__dirname}/../DB/sequelize`);
const bcrypt = require("bcryptjs");

//Creating model
const User = sequelize.define(
  "User",
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 4,
        isAlphanumeric: {
          value: true,
          msg: "Please enter numbers and alphabets only",
        },
      },
    },
    confirmPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEqual(currPassword) {
          if (currPassword !== this.password) throw new Error("Password do not match");
        },
      },
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user",
      validate: {
        isIn: [["user", "admin", "tenant"]],
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    defaultScope: {
      where: { active: true },
      attributes: { exclude: ["password", "confirmPassword"] },
    },
    scopes: {
      withPassword: {
        attributes: { exclude: ["confirmPassword"] },
      },
    },
  },
  {
    tableName: "users",
  }
);

//
// User.hasMany(Product, { as: "products" });
// Product.belongsTo(Product, {
//   foreignKey: "UserId",
// });

//Adding hooks
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 12);
  user.confirmPassword = undefined;
});

//Syncronization of model with existing table
(async () => {
  await User.sync();
})();

module.exports = User;
