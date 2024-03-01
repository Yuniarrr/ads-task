const userService = require('../services').user;

module.exports = {
    async updateUser(req, res, next) {
        try {
            await userService.updateUser(req, res);

            return res.send({ message: 'Update profile success' });
        } catch (error) {
            console.log("in error processing updateUser");
            next(error.message);
        }
    },

    async findUserById(req, res, next) {
        try {
            const { id } = req.user;
            const user = await userService.findUserById(id);

            return res.status(200).send({
                username: user.username,
                email: user.email,
                no_telp: user.no_telp,
                otp_enabled: user.otp_enabled
            });
        } catch (error) {
            console.log("in error processing findUserById");
            next(error.message);
        }
    }
} 