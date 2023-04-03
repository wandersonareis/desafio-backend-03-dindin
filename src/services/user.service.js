const knex = require("../db/dbClient");

/**
 * Busca um usuário no banco de dados pelo seu ID.
 *
 * @param {number} user_id - O ID do usuário a ser buscado.
 * @returns {Promise<object>} Uma promessa que resolve com o objeto do usuário encontrado.
 */
async function findUserById(id) {
  return await knex("usuarios").first('id', 'nome', 'email').where({ id });
}

/**
 * Conta o número de usuários no banco de dados com um determinado endereço de e-mail.
 *
 * @param {string} user_email - O endereço de e-mail a ser procurado.
 * @returns {boolean} Um booleano se o e-mail fornecido já está cadastrado.
 */
async function emailExist(email) {
  const userEmailCount = await knex("usuarios").count().where({ email }).first();
  return userEmailCount.count > 0;
}

/**
 * Busca um usuário no banco de dados pelo endereço de e-mail.
 *
 * @param {string} user_email - O endereço de e-mail do usuário a ser buscado.
 * @returns {Promise<Object>} Uma promessa que resolve com o resultado da consulta.
 */
async function findUserByEmail(email) {
  return await await knex("usuarios").where({ email }).first();
}

/**
 * Cria um novo usuário no banco de dados com o nome, endereço de e-mail e senha fornecidos.
 *
 * @param {number} user_id - O id do novo usuário.
 * @param {string} user_name - O nome do novo usuário.
 * @param {string} user_email - O endereço de e-mail do novo usuário.
 * @returns {Promise<Object>} Uma promessa que resolve com o objeto que representa o novo usuário criado.
 */
async function createtUser(user_name, user_email, user_password) {
  [result] = await knex("usuarios").insert({ nome: user_name, email: user_email, senha: user_password }).returning(["id", "nome", "email"]);
  return result;
}

/**
 * Atualiza um usuário existente no banco de dados com um novo nome, endereço de e-mail e senha.
 *
 * @param {number} user_id - ID do usuário sendo atualizado
 * @param {string} user_name - O novo nome do usuário.
 * @param {string} user_email - O novo endereço de e-mail do usuário.
 * @param {string} user_password - A nova senha criptografada do usuário.
 * @returns {Promise<Object>} Uma promessa que resolve quando a atualização é concluída.
 */
async function updateUser(id, user_name, user_email, user_password) {
  return await knex("usuarios").where({ id }).update({ nome: user_name, email: user_email, senha: user_password });
}

module.exports = { emailExist, findUserById, findUserByEmail, createtUser, updateUser };
