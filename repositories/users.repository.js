const User = require('../models').User;

module.exports = {
    async findUserByEmail(email) {
        return await User.findOne({ where: { email: email } });
    },
    async findUserByNoTelp(no_telp) {
        return await User.findOne({ where: { no_telp: no_telp } });
    },
    async createUser(user) {
        return await User.create(user);
    },
    async updateUser(where, user) {
        return await User.update(user, { where: where });
    },
    async findUserById(id) {
        return await User.findByPk(id);
    },
};