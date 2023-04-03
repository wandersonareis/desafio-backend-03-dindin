const knex = require("../db/dbClient");
const { passwordIsNotValid } = require("../utils/passwordsUtil");
const ErrorHandler = require("./errorHandling/errorHandler.class");

async function userLoginValidate(req, res, next) {
  const { email: body_email, senha: body_password } = req.body;
  const userInvalidMsg = "Usuário e/ou senha inválido(s).";
  try {
    const user = await knex("usuarios").where({ email: body_email }).first();

    if (!user) throw new ErrorHandler(userInvalidMsg, 404);

    const { senha: user_password, ...userDto } = user;
    
    const isNotValid = await passwordIsNotValid(body_password, user_password);
    if (isNotValid) throw new ErrorHandler(userInvalidMsg, 400);

    req.user = userDto;
    next();
  } catch (error) {
    next(error);
  }
}

async function userCommonMiddleware(req, res, next) {
  const body_email = req.body.email;
  const user_email = req.user?.email;

  const emailExists = await knex("usuarios").where({ email: body_email }).first();

  try {
    if (emailExists && user_email !== body_email) {
      throw new ErrorHandler("O e-mail informado já está sendo utilizado por outro usuário.", 401);
    }
    
    if (emailExists && !user_email) {
      throw new ErrorHandler("O e-mail informado já está sendo utilizado por outro usuário.", 401);
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { userLoginValidate, userCommonMiddleware };
