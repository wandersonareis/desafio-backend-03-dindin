async function transactionFilterValidate(req, res, next) {
  const filters = req.query.filtro;

  req.filters = filters ? filters : [];

  next();
}

module.exports = { transactionFilterValidate };
