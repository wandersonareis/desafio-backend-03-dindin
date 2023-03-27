const ErrorHandler = require("./errorHandler.class");

function notFoundHandler(req, res, next) {
    const error = new ErrorHandler(`A rota '${req.url}' não foi encontrada.`, 404);
    next(error);
  }

  module.exports = notFoundHandler;