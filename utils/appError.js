//Creating a class called AppError which extends Error class, so that we can easily modify error message.

class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "Failed" : "Error";
  }
}

module.exports = AppError;
