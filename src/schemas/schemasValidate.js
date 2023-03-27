const { transactionSchema, accountCreateSchema, accountLoginSchema } = require("./joiSchema");

function userAccountCreateSchema(req, res, next) {
  const schema = accountCreateSchema;
  validateRequest(req, res, next, schema);
}

function userAccountLoginSchema(req, res, next) {
  const schema = accountLoginSchema;
  validateRequest(req, res, next, schema);
}

function transactionMainSchema(req, res, next) {
  const schema = transactionSchema;
  validateRequest(req, res, next, schema);
}

function validateRequest(req, res, next, schema) {
  try {
    const { error: schemaError } = schema.validate(req.body, {
      abortEarly: false,
    });

    if (schemaError) {
      const erros = schemaError.details.map((detail) => detail.message);
      return res.status(400).json({ mensagem: "Dados inválidos", erros });
    }

    next();
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno no servidor." });
  }
}
module.exports = { userAccountCreateSchema, userAccountLoginSchema, transactionMainSchema };
