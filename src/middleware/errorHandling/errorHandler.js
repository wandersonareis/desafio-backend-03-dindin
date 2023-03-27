function errorHandler(err, req, res, next) {
  const message = err.statusCode ? err.message : 'Erro interno no servidor';
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({ mensagem: message });
}


module.exports = errorHandler;
