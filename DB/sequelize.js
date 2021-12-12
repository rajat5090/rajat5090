//Importing modules
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

//Configure path
dotenv.config({ path: `${__dirname}/../config.env` });

//Connecting to database
//Creating instance
console.log(process.env.DATABASE_PASSWORD);
const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: "mysql",
  }
);

//Validating database connection
sequelize
  .validate()
  .then((con) => {
    console.log("Database is connected successfully");
  })
  .catch((err) => console.log("Something went wrong while connecting database: ", err));

//Exporting module
module.exports = sequelize;
