const AuthService = require('../services').auth;

module.exports = {
    async register(req, res) {
        try {
            const { no_telp, email } = req.body;
            if (!no_telp && !email) {
                return res.status(400).send({ message: 'No telp or email is required' });
            }
            await AuthService.register(req, res);
        } catch (error) {
            console.error(error);
            return res.status(500).send("Internal Server Error");
        }
    },

    async login(req, res) {
        try {
            await AuthService.login(req, res);
        } catch (error) {
            console.log("in error processing login")
            console.error(error);
            return res.status(500).send("Internal Server Error");
        }
    }
};