const pool = require("./dbPool");



/**
 * Busca uma transação no banco de dados com base no ID do usuário e no ID da transação.
 *
 * @param {number} user_id - ID do usuário a ser buscado.
 * @param {number} transaction_id - ID da transação a ser buscada.
 * @returns {Promise<Object>} Um objeto representando a transação encontrada no banco de dados.
 */
async function findTransaction(user_id, transaction_id) {
  return await pool.query("select * from transacoes where id=$1 and usuario_id=$2", [transaction_id, user_id]);
}

/**
 * Retorna o número de transações correspondentes ao usuário e ID da transação fornecidos.
 *
 * @param {number} user_id - O ID do usuário.
 * @param {number} transaction_id - O ID da transação.
 * @returns {Promise<number>} O número de transações correspondentes.
 */
async function countTransaction(user_id, transaction_id) {
  const result = await pool.query("select count(*) from transacoes where id=$1 and usuario_id=$2", [transaction_id, user_id]);
  return parseInt(result.rows[0].count);
}

/**
 * Busca todas as transações de um usuário no banco de dados pelo ID do usuário e ID da categoria.
 *
 * @param {number} user_id - O ID do usuário cujas transações serão buscadas.
 * @param {number} categorie_id - O ID da categoria cujas transações serão buscadas.
 * @returns {Promise<object>} Uma promessa que resolve com um array contendo as transações encontradas.
 */
async function findUserTransactionsByCategoryId(user_id, categorie_id) {
  return await pool.query("select * from transacoes where usuario_id=$1 and categoria_id=$2", [user_id, categorie_id]);
}

/**
 * Retorna todas as categorias de itens do banco de dados.
 *
 * @returns {Promise<Object>} Uma promessa que resolve com todas as categorias de itens do banco de dados.
 */
async function categoriesItens() {
  return await pool.query("select id, descricao as nome from categorias");
}

/**
 * Busca uma categoria no banco de dados pelo ID.
 *
 * @param {number} categorie_id - O ID da categoria a ser buscada.
 * @returns {Promise<object>} Um objeto representando a categoria encontrada.
 */
async function findOneCategorie(categorie_id) {
  return await pool.query("select * from categorias where id=$1", [categorie_id]);
}
/**
 * Conta o número de itens em uma categoria específica no banco de dados.
 *
 * @param {string} categorie_id - O ID da categoria a ser contada.
 * @returns {Promise<number>} Uma promessa que resolve com o número de itens na categoria especificada.
 */
async function countCategories(categorie_id) {
  const result = await pool.query("select count(*) as count from categorias where id = $1", [categorie_id]);
  return parseInt(result.rows[0].count);
}

/**
 * Cria uma nova transação no banco de dados.
 *
 * @param {string} transaction_type - O tipo da transação (pode ser "entrada" ou "saída").
 * @param {string} transaction_description - A descrição da transação.
 * @param {number} transaction_value - O valor da transação.
 * @param {Date} transaction_date - A data da transação.
 * @param {number} user_id - O ID do usuário que realizou a transação.
 * @param {number} categorie_id - O ID da categoria da transação.
 * @param {string} categoria_nome - O nome da categoria da transação.
 * @returns {Promise<object>} Uma promessa que resolve com o objeto da transação criada.
 */
async function createTransaction(transaction_type, transaction_description, transaction_value, transaction_date, user_id, categorie_id, categorie_nome) {
  return await pool.query(
    "insert into transacoes (tipo, descricao, valor, data, usuario_id, categoria_id, categoria_nome) values ($1, $2, $3, $4, $5, $6, $7) returning *",
    [transaction_type, transaction_description, transaction_value, transaction_date, user_id, categorie_id, categorie_nome]
  );
}







module.exports = {
  findUserTransactionsByCategoryId,

  findTransaction,
  countTransaction,

  createTransaction,


  categoriesItens,
  countCategories,
  findOneCategorie,
};
