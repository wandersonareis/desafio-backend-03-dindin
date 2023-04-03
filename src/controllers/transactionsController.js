const knex = require("../db/dbClient");
const ErrorHandler = require("../middleware/errorHandling/errorHandler.class");

async function transactionCreate(req, res, next) {
  try {
    const {
      tipo: transaction_type,
      descricao: transaction_description,
      valor: transaction_value,
      data: transaction_date,
      categoria_id: category_id,
    } = req.body;

    const { id: user_id } = req.user;
    const { descricao: category_name } = req.categorie;

    const [transaction] = await knex("transacoes")
      .insert({
        tipo: transaction_type,
        descricao: transaction_description,
        valor: transaction_value,
        data: transaction_date,
        usuario_id: user_id,
        categoria_id: category_id,
        categoria_nome: category_name,
      })
      .returning("*");

    return res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
}

async function transactionUpdate(req, res, next) {
  const { tipo: transaction_type, descricao: transaction_description, valor: transaction_value, data: transaction_date } = req.body;
  const { id: user_id } = req.user;
  const { id: transaction_id } = req.transaction;
  const { id: category_id, descricao: category_name } = req.categorie;
  try {
    await knex("transacoes")
      .update({
        tipo: transaction_type,
        descricao: transaction_description,
        valor: transaction_value,
        data: transaction_date,
        categoria_id: category_id,
        categoria_nome: category_name,
      })
      .where({ id: transaction_id })
      .andWhere({ usuario_id: user_id });

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

async function transactionDelete(req, res, next) {
  const { id: transaction_id } = req.params;
  const { id: user_id } = req.user;

  try {
    await knex("transacoes").del().where({ id: transaction_id }).andWhere({ usuario_id: user_id });

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

async function transactionsHistorySum(req, res, next) {
  try {
    const { id: user_id } = req.user;

    const credit_transactions = await knex("transacoes").where({ usuario_id: user_id, tipo: "entrada" }).sum("valor").first();
    const debit_transactions = await knex("transacoes").where({ usuario_id: user_id, tipo: "saida" }).sum("valor").first();

    return res.json({
      entrada: Number(credit_transactions.sum),
      saida: Number(debit_transactions.sum),
    });
  } catch (error) {
    next(error);
  }
}
async function transactionsListByUser(req, res, next) {
  try {
    const { id: user_id } = req.user;
    const filters = req.filters;

    const transactions = await knex("transacoes").select("*").where("usuario_id", user_id);

    if (filters.length > 0 && transactions) {
      const transacionFiltered = transactions.filter((t) => filters.includes(t.categoria_nome));
      return res.json(transacionFiltered);
    }

    return res.json(transactions);
  } catch (error) {
    next(error);
  }
}

async function transactionsById(req, res, next) {
  try {
    if (req.transaction) return res.json(req.transaction);
    throw new ErrorHandler("Transação informada não encontrada.", 404);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  transactionCreate,
  transactionsListByUser,
  transactionUpdate,
  transactionDelete,
  transactionsHistorySum,
  transactionsById,
};
