const joi = require("joi");

const nameSchema = joi.string().min(3).max(30).required().messages({
  "string.empty": "O campo nome é obrigatório",
  "string.min": "O campo nome deve ter pelo menos {#limit} caracteres",
  "string.max": "O campo nome deve ter no máximo {#limit} caracteres",
  "any.required": "O campo nome é obrigatório",
});

const emailSchema = joi
  .string()
  .email({ tlds: { allow: false } })
  .required()
  .messages({
    "string.empty": "O campo email é obrigatório",
    "string.email": "O email informado não é válido",
    "any.required": "O campo email é obrigatório",
  });

const passwordSchema = joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required().messages({
  "string.empty": "O campo senha é obrigatório",
  "string.pattern.base": "A senha deve conter apenas letras e números e ter entre 3 e 30 caracteres",
  "any.required": "O campo senha é obrigatório",
});

const accountCreateSchema = joi.object({
  nome: nameSchema,
  email: emailSchema,
  senha: passwordSchema,
});

const accountLoginSchema = joi.object({
  email: emailSchema,
  senha: passwordSchema,
});

const transactionSchema = joi.object({
  tipo: joi.string().valid("entrada", "saida").required().messages({
    "any.required": 'O campo "tipo" é obrigatório.',
    "any.only": 'O campo "tipo" deve ser "entrada" ou "saida".',
  }),
  descricao: joi
    .string()
    .pattern(/^[\p{L}\d\s]+$/u)
    .required()
    .messages({
      "string.empty": 'O campo "descricao" não pode ser vazio.',
      "string.pattern.base": 'O campo "descricao" deve conter apenas letras e números.',
    }),
  valor: joi.number().integer().min(0).required().messages({
    "number.base": 'O campo "valor" deve ser um número inteiro e em centavos.',
    "number.empty": 'O campo "valor" não pode ser vazio.',
    "number.min": 'O campo "valor" deve ser maior ou igual a 0.',
  }),
  data: joi.date().iso().required().messages({
    "any.required": 'O campo "data" é obrigatório.',
    "date.isoDate": 'O campo "data" deve ser uma data no formato ISO.',
  }),
  categoria_id: joi.number().required().messages({
    "any.required": 'O campo "categoria_id" é obrigatório.',
  }),
}).messages({
  "object.base": "O valor informado deve ser um objeto válido",
});;

module.exports = { accountCreateSchema, accountLoginSchema, transactionSchema };
