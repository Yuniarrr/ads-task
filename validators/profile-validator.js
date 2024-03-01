const Joi = require('joi');

const ProfileSchema = Joi.object().keys({
    name: Joi.string(),
    image: Joi.any()
});

module.exports = ProfileSchema;