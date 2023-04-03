const knex = require("../db/dbClient");
const { emailExist, findUserByEmail } = require("../services/user.service");

const { passwordIsNotValid, passwordExclude } = require("../utils/passwordsUtil");
const ErrorHandler = require("./errorHandling/errorHandler.class");

async function userLoginValidate(req, res, next) {
  const { email: body_email, senha: body_password } = req.body;
  const userInvalidMsg = "Usuário e/ou senha inválido(s).";
  try {
    const user = await findUserByEmail(body_email);

    if (!user) throw new ErrorHandler(userInvalidMsg, 404);

    const isNotValid = await passwordIsNotValid(body_password, user.senha);
    if (isNotValid) throw new ErrorHandler(userInvalidMsg, 400);

    req.user = passwordExclude(user);
    next();
  } catch (error) {
    next(error);
  }
}

async function userCommonMiddleware(req, res, next) {
  const body_email = req.body?.email;
  const user_email = req.user?.email;
  try {
    if (user_email && user_email !== body_email) {
      const emailExists = await emailExist(body_email);

      if (emailExists) {
        throw new ErrorHandler("O e-mail informado já está sendo utilizado por outro usuário.", 401);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { userLoginValidate, userCommonMiddleware };
