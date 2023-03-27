const { findUserById } = require("../db/dbServices");
const ErrorHandler = require("../middleware/errorHandling/errorHandler.class");
const { passwordExclude } = require("../utils/passwordsUtil");

async function authenticationValidate(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  const authErrorMsg = "Para acessar este recurso um token de autenticação válido deve ser enviado.";

  try {
    if (!token) throw new ErrorHandler(authErrorMsg, 401);

    const jwt = require("jsonwebtoken");
    const { id: user_id } = jwt.verify(token, process.env.PGSECUREKEY);
    const { rows, rowCount } = await findUserById(user_id);
    const result = rows[0];

    if (rowCount === 0) throw new ErrorHandler(authErrorMsg, 401);

    req.user = passwordExclude(result);
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const expiredTokenError = new ErrorHandler("Autorização expirada.", 419);
      return next(expiredTokenError);
    }
    next(error);
  }
}

module.exports = authenticationValidate;
