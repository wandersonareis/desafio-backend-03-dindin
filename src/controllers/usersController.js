const jwt = require("jsonwebtoken");

const { cryptPassword } = require("../utils/passwordsUtil");
const { createtUser, updateUser } = require("../services/user.service");

async function registerUser(req, res, next) {
  const { nome: body_name, email: body_email, senha: body_password } = req.body;
  try {
    const body_password_encoded = await cryptPassword(body_password);
    const result = await createtUser(body_name, body_email, body_password_encoded);
    
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
    const { nome: name, email, senha: password } = req.body;

    const password_encoded = await cryptPassword(password);
    await updateUser(user_id, name, email, password_encoded);

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

module.exports = { registerUser, userLogin, userDetails, userUpdate };
