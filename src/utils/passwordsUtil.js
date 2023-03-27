const bcrypt = require("bcrypt");

/**
 *
 * @param {string} password - A senha a ser criptografada.
 * @returns {Promise<string>} Uma Promise que resolve com a senha criptografada.
 */
async function cryptPassword(password) {
  return await bcrypt.hash(password, 10);
}

/**
@param {string} bodyPassword - A senha não criptografada enviada no corpo da requisição.
@param {string} userPassword - A senha criptografada armazenada no banco de dados ou em outra fonte segura.
@returns {Promise<boolean>} Uma Promise que resolve com um valor booleano indicando se a senha não é válida.
*/
async function passwordIsNotValid(bodyPassword, userPassword) {
  return !(await bcrypt.compare(bodyPassword, userPassword));
}

/**
@param {Object} userPassword - Um objeto que contém a senha do usuário.
@returns {Object} Um novo objeto que contém todas as propriedades do objeto original, exceto a propriedade "senha".
*/
function passwordExclude(userPassword) {
  const { senha: _, ...user } = userPassword;
  return user;
}

module.exports = { cryptPassword, passwordIsNotValid, passwordExclude };
