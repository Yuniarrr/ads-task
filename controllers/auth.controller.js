const AuthService = require('../services').auth;

module.exports = {
    async register(req, res, next) {
        try {
            const { username, email, password, no_telp } = req.body;

            if (!no_telp && !email) {
                return res.status(400).send({ message: 'No telp or email is required' });
            }

            const user = await AuthService.register(username, email, password, no_telp);

            return res.status(201).json({
                id: user.id,
                username: user.username,
                email: user.email,
                no_telp: user.no_telp,
            });
        } catch (error) {
            console.log("in error processing register");
            next(error.message);
        }
    },

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const token = await AuthService.loginWithPassword(email, password);

            return res.status(200).send({ token });
        } catch (error) {
            console.log("in error processing login");
            next(error.message);
        }
    },

    async generateOtp(req, res, next) {
        try {
            const { email, no_telp } = req.body;
            if (!no_telp && !email) {
                return res.status(400).send({ message: 'No telp or email is required' });
            }

            const { secret, uri } = await AuthService.generateOtp(email, no_telp);

            return res.status(200).send({
                secret, uri
            });
        } catch (error) {
            console.log("in error processing generateOtp")
            next(error.message);
        }
    },

    async verifyOtp(req, res, next) {
        try {
            const { email, no_telp, token } = req.body;
            if (!no_telp && !email) {
                return res.status(400).send({ message: 'No telp or email is required' });
            }

            const tokenLogin = await AuthService.verifyOtp(email, no_telp, token);

            return res.status(200).send({ token: tokenLogin });
        } catch (error) {
            console.log("in error processing verifyOtp")
            next(error.message);
        }
    },

    async enabled2FA(req, res, next) {
        try {
            const { id } = req.user;
            await AuthService.enabled2FA(id);

            return res.status(200).send({ message: '2FA enabled' });
        } catch (error) {
            console.log("in error processing enabled2FA");
            next(error.message);
        }
    },
};