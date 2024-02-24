const Joi = require('joi')

const loginSchema = Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
});

module.exports = loginSchema;
