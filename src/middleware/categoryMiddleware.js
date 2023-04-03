const knex = require("../db/dbClient");
const ErrorHandler = require("./errorHandling/errorHandler.class");

async function categoryValidateMiddleware(req, res, next) {
  try {
    const { categoria_id: category_id } = req.body;
    const category = await knex("categorias").first("descricao").where({ id: category_id });

    if (!category) throw new ErrorHandler("Categoria informada não existe.", 404);

    req.categorie = category;

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = categoryValidateMiddleware;
