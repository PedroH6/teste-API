const Joi = require("joi");

const usuarioSchema = Joi.object({
  usuarios: Joi.array().items({
    nome: Joi.string(),
    email: Joi.string(),
    password: Joi.string(),
    administrador: Joi.string().valid("true", "false"),
    _id: Joi.string(),
  }),
    quantidade: Joi.number(),
});

export default usuarioSchema;
