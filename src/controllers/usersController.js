const knex = require("../db/dbClient");
const jwt = require("jsonwebtoken");

const { cryptPassword } = require("../utils/passwordsUtil");

async function registerUser(req, res, next) {
  const { nome: body_name, email: body_email, senha: body_password } = req.body;
  try {
    const body_password_encoded = await cryptPassword(body_password);
    const [result] = await knex("usuarios").insert({ nome: body_name, email: body_email, senha: body_password_encoded }).returning(["id", "nome", "email"]);

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

function userLogin(req, res) {
  const user = req.user;
  const token = jwt.sign({ id: user.id }, process.env.PGSECUREKEY, {
    expiresIn: "8h",
  });

  return res.json({ usuario: user, token });
}

function userDetails(req, res) {
  res.json(req.user);
}

async function userUpdate(req, res, next) {
  try {
    const { id: user_id } = req.user;
    const { nome: body_name, email: body_email, senha: body_password } = req.body;

    const body_password_encoded = await cryptPassword(body_password);
    await knex("usuarios").where({ id: user_id }).update({ nome: body_name, email: body_email, senha: body_password_encoded });

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

module.exports = { registerUser, userLogin, userDetails, userUpdate };
