const knex = require("../db/dbClient");
const ErrorHandler = require("./errorHandling/errorHandler.class");

async function transactionIdValidateMiddleware(req, res, next, id) {
  const { id: user_id } = req.user;

  try {
    const transaction_id = Number(id);

    if (transaction_id && Number.isInteger(transaction_id) && transaction_id > 0) {
      const transaction = await knex("transacoes").first("*").where({ id: transaction_id }).andWhere({ usuario_id: user_id });

      if (!transaction) throw new ErrorHandler("Transação informada não encontrada.", 404);

      req.transaction = transaction;
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = transactionIdValidateMiddleware;
