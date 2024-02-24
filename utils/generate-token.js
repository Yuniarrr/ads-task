const jwt = require('jsonwebtoken');

const getToken = async (id, email) => {
    const payload = { email, id };
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    return token;
}

module.exports = getToken;