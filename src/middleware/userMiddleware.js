const { findUserByEmail, countUserEmails } = require("../db/dbServices");

const { passwordIsNotValid, passwordExclude } = require("../utils/passwordsUtil");
const ErrorHandler = require("./errorHandling/errorHandler.class");

async function userLoginValidate(req, res, next) {
  const { email: body_email, senha: body_password } = req.body;
  const userInvalidMsg = "Usuário e/ou senha inválido(s).";
  try {
    const { rows, rowCount } = await findUserByEmail(body_email);
    const user = rows[0];

    if (rowCount === 0) throw new ErrorHandler(userInvalidMsg, 404);

    const isNotValid = await passwordIsNotValid(body_password, user.senha);
    if (isNotValid) throw new ErrorHandler(userInvalidMsg, 400);

    req.user = passwordExclude(user);
    next();
  } catch (error) {
    next(error);
  }
}

async function userCreateValidate(req, res, next) {
  const { email: body_email } = req.body;

  try {
    const userEmailCount = await countUserEmails(body_email);

    if (userEmailCount > 0) throw new ErrorHandler("Já existe usuário cadastrado com o e-mail informado.", 400);

    next();
  } catch (error) {
    next(error);
  }
}
async function userUpdateValidate(req, res, next) {
  const { email: body_email } = req.body;
  const { email: user_email } = req.user;
  try {
    if (user_email !== body_email) {
      const { rowCount: EmailExists } = await findUserByEmail(body_email);

      if (EmailExists > 0) {
        throw new ErrorHandler("O e-mail informado já está sendo utilizado por outro usuário.", 401);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { userLoginValidate, userCreateValidate, userUpdateValidate };
