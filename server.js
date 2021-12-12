//Importing required modules
const app = require("./app");
const dotenv = require("dotenv");

//Configure path
dotenv.config({ path: `${__dirname}/config.env` });

const port = process.env.PORT || 9000;

//Starting server
app.listen(port, () => console.log(`server is ready to accept request on port ${port}`));
