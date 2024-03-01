const createHttpError = require('http-errors')
const Joi = require('joi')
const Validators = require('../validators')

module.exports = function (validator) {
    if (!Validators.hasOwnProperty(validator))
        throw new Error(`'${validator}' validator is not exist`)

    return async function (req, res, next) {
        try {
            const validated = await Validators[validator].validateAsync(req.body)
            req.body = validated
            next()
        } catch (err) {
            console.log("error in validators");
            if (err.isJoi)
                // return next(createHttpError(422, { message: err.message }))
                return res.status(422).json({ message: err.message })
            // next(createHttpError(500)) 
            return res.status(500).json({ message: err.message })
        }
    }
}