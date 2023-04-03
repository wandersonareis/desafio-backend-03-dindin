const knex = require("../db/dbClient");
const { findUserTransactions, updateTransaction, deleteTansaction, transactionsValueSum } = require("../db/dbServices");

async function transactionCreate(req, res) {
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

async function transactionUpdate(req, res) {
  const { tipo: transaction_type, descricao: transaction_description, valor: transaction_value, data: transaction_date } = req.body;
  const { id: user_id } = req.user;
  const { id: transacao_id } = req.transaction;
  const { id: categorie_id, descricao: categorie_name } = req.categorie;
  try {
    await updateTransaction(
      user_id,
      transacao_id,
      transaction_type,
      transaction_description,
      transaction_value,
      transaction_date,
      categorie_id,
      categorie_name
    );

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

async function transactionDelete(req, res) {
  const { id: transacao_id } = req.params;
  const { id: user_id } = req.user;

  try {
    await deleteTansaction(transacao_id, user_id);

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

async function transactionsHistorySum(req, res) {
  try {
    const { id: user_id } = req.user;
    const credit_transactions = await transactionsValueSum(user_id, "entrada");
    const debit_transactions = await transactionsValueSum(user_id, "saida");

    return res.json({
      entrada: credit_transactions,
      saida: debit_transactions,
    });
  } catch (error) {
    next(error);
  }
}
async function transactionsListByUser(req, res) {
  try {
    const { id: user_id } = req.user;
    const filters = req.filters;
    const { rows: transactions, rowCount: transactionsCount } = await findUserTransactions(user_id);

    if (filters.length > 0 && transactionsCount > 0) {
      const transacionFiltered = transactions.filter((t) => filters.includes(t.categoria_nome));
      return res.json(transacionFiltered);
    }

    return res.json(transactions);
  } catch (error) {
    next(error);
  }
}

async function transactionsByCategoryId(req, res, next) {
  if (req.transaction) return res.json(req.transaction);

  next();
}

module.exports = {
  transactionCreate,
  transactionsListByUser,
  transactionUpdate,
  transactionDelete,
  transactionsHistorySum,
  transactionsByCategoryId,
};
