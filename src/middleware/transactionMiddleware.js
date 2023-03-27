const { findOneCategorie, findTransaction } = require("../db/dbServices");
const ErrorHandler = require("./errorHandling/errorHandler.class");

async function transactionCreateValidate(req, res, next) {
  try {
    const { categoria_id: categorie_id } = req.body;
    const categorie = await categorieExists(categorie_id);

    req.categorie = categorie;
    next();
  } catch (error) {
    next(error);
  }
}

async function transactionUpdateValidate(req, res, next) {
  try {
    const { categoria_id: categorie_id } = req.body;

    const categorie = await categorieExists(categorie_id);
    req.categorie = categorie;

    next();
  } catch (error) {
    next(error);
  }
}

async function transactionIdValidate(req, res, next, id) {
  const { id: user_id } = req.user;

  try {
    const transaction_id = Number(id);
    
    if (transaction_id && Number.isInteger(transaction_id) && transaction_id > 0) {
      const { rows: transaction, rowCount: transactionCount } = await findTransaction(user_id, transaction_id);

      if (transactionCount === 0) throw new ErrorHandler("Transação informada não encontrada.", 404);

      req.transaction = transaction[0];
    }

    next();
  } catch (error) {
    next(error);
  }
}

async function categorieExists(categorie_id) {
  const { rows: categories, rowCount: categorieCount } = await findOneCategorie(categorie_id);

  try {
    if (categorieCount === 0) throw new ErrorHandler("Categoria informada não existe.", 404);

    return categories[0];
  } catch (error) {
    next(error);
  }
}

module.exports = { transactionCreateValidate, transactionUpdateValidate, transactionIdValidate };
