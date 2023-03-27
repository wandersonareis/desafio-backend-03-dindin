const { categoriesItens } = require("../db/dbServices");

async function categoriesList(req, res) {
  const { rows: categories } = await categoriesItens();
  return res.json(categories);
}

module.exports = { categoriesList };
