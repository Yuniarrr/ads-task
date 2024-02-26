const Joi = require('joi')

const generateOtpSchema = Joi.object().keys({
    email: Joi.string().email(),
    no_telp: Joi.string().min(10).max(20),
});

module.exports = generateOtpSchema;
