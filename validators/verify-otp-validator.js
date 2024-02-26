const Joi = require('joi')

const VerifyOtpSchema = Joi.object().keys({
    email: Joi.string().email(),
    no_telp: Joi.string().min(10).max(20),
    token: Joi.number().min(6),
});

module.exports = VerifyOtpSchema;
