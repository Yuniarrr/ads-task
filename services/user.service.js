const User = require('../models').User;

module.exports = {
    findUserByEmail(email) {
        return User.findOne({ where: { email: email } });
    },

    findUserByNoTelp(no_telp) {
        return User.findOne({ where: { no_telp: no_telp } });
    },

    findUserById(id) {
        return User.findByPk(id);
    }
}