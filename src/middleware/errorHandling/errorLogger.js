const ErrorHandler = require("./errorHandler.class");

function errorLogger(err, req, res, next) {
  try {
    if (!err.statusCode && err.message) {
      console.log(`Erro: ${err.message}`);
      throw new ErrorHandler();
    }

    next(err);
  } catch (error) {
    next(error);
  }
}

module.exports = errorLogger;
