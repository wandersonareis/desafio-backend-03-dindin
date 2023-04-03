const pool = require("./dbPool");

/**
 * Busca todas as transações de um usuário no banco de dados pelo seu ID.
 *
 * @param {number} user_id - O ID do usuário cujas transações serão buscadas.
 * @returns {Promise<object>} Uma promessa que resolve com um array contendo as transações encontradas.
 */
async function findUserTransactions(user_id) {
  return await pool.query("select * from transacoes where usuario_id=$1", [user_id]);
}

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

/**
 * Atualiza uma transação na tabela 'transacoes' do banco de dados.
 *
 * @param {number} user_id - ID do usuário dono da transação.
 * @param {number} transaction_id - ID da transação
 * @param {string} transaction_type - Tipo da transação (entrada ou saída).
 * @param {string} transaction_description - Descrição da transação.
 * @param {number} transaction_value - Valor da transação.
 * @param {Date} transaction_date - Data da transação.
 * @param {number} categorie_id - ID da categoria da transação.
 * @param {string} categorie_name - Nome da categoria da transação.
 * @returns {Promise} - Promessa que resolve com o resultado da consulta SQL.
 */
async function updateTransaction(
  user_id,
  transaction_id,
  transaction_type,
  transaction_description,
  transaction_value,
  transaction_date,
  categorie_id,
  categorie_name
) {
  return await pool.query("update transacoes set tipo=$1, descricao=$2, valor=$3, data=$4, categoria_id=$5, categoria_nome=$6 where id=$7 and usuario_id=$8", [
    transaction_type,
    transaction_description,
    transaction_value,
    transaction_date,
    categorie_id,
    categorie_name,
    transaction_id,
    user_id,
  ]);
}

/**
 * Deleta uma transação na tabela 'transacoes' do banco de dados.
 *
 * @param {string} transaction_id - ID da transação a ser deletada.
 * @param {number} user_id - ID do usuário dono da transação.
 * @returns {Promise} - Promessa que resolve com o resultado da consulta SQL.
 */
async function deleteTansaction(transaction_id, user_id) {
  return await pool.query("delete from transacoes where id=$1 and usuario_id=$2", [transaction_id, user_id]);
}

/**
 * Retorna a soma dos valores de todas as transações do usuário com um determinado tipo (entrada ou saída).
 *
 * @param {number} user_id - ID do usuário.
 * @param {string} transaction_type - Tipo de transação (entrada ou saída).
 * @returns {Promise<number>} Soma dos valores das transações do tipo especificado pelo usuário.
 */
async function transactionsValueSum(user_id, transaction_type) {
  const { rows } = await pool.query("select sum(valor) from transacoes where usuario_id=$1 and tipo=$2", [user_id, transaction_type]);
  return Number(rows[0].sum);
}

module.exports = {
  findUserTransactions,
  findUserTransactionsByCategoryId,

  findTransaction,
  countTransaction,

  createTransaction,
  updateTransaction,
  deleteTansaction,

  transactionsValueSum,

  categoriesItens,
  countCategories,
  findOneCategorie,
};
