const Joi = require('joi');

const registerSchema = Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email(),
    password: Joi.string().required(),
    no_telp: Joi.string().min(10).max(20)
});

module.exports = registerSchema;