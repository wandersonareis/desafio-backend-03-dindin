async function transactionFilterValidateMiddleware(req, res, next) {
  const filters = req.query.filtro;

  req.filters = filters ? filters : [];

  next();
}

module.exports = transactionFilterValidateMiddleware;
