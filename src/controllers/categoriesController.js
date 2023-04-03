const knex = require("../db/dbClient");

async function categoriesList(req, res) {
  const categories = await knex("categorias").select("*");
  return res.json(categories);
}

module.exports = categoriesList;
