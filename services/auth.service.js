const User = require('../models').User;
const generateToken = require('../utils/generate-token')
const hashPassword = require('../utils/hash-password');
const userRepository = require('../repositories').users;
const bcryptjs = require('bcryptjs')
const { authenticator } = require("otplib");

module.exports = {
    async register(username, email, password, no_telp) {
        if (email) {
            const user = await userRepository.findUserByEmail(email);
            if (user) {
                throw new Error('Email already exists');
            }
        } else if (no_telp) {
            const user = await userRepository.findUserByNoTelp(no_telp);
            if (user) {
                throw new Error('No telp already exists');
            }
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await userRepository.createUser({
            username,
            email,
            password: hashedPassword,
            no_telp,
            otp_enabled: true,
        });

        return newUser;
    },

    async loginWithPassword(email, password) {
        const isUserExist = await userRepository.findUserByEmail(email);

        if (!isUserExist) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcryptjs.compare(password, isUserExist.password);

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = await generateToken(isUserExist.id);

        return token;
    },

    async generateOtp(email, no_telp) {
        const secret = authenticator.generateSecret();
        let uri;
        email ? uri = authenticator.keyuri(email, process.env.AUTHENTICATOR_ISSUER, secret) : uri = authenticator.keyuri(no_telp, process.env.AUTHENTICATOR_ISSUER, secret);

        if (email) {
            const isUserExist = await userRepository.findUserByEmail(email);

            if (!isUserExist) {
                throw new Error('Invalid credentials');
            }

            if (!isUserExist.otp_enabled) {
                throw new Error('2FA not enabled');
            }

            await userRepository.updateUser({ email: email }, {
                otp_auth_url: uri,
                secret: secret,
            });

            return { secret, uri };
        } else if (no_telp) {
            const isUserExist = await userRepository.findUserByNoTelp(no_telp);

            if (!isUserExist) {
                throw new Error('Invalid credentials');
            }

            if (!isUserExist.otp_enabled) {
                throw new Error('2FA not enabled');
            }

            await userRepository.updateUser({ no_telp: no_telp }, {
                otp_auth_url: uri,
                secret: secret,
            });
            return { secret, uri };
        }
    },

    async verifyOtp(email, no_telp, token) {
        if (email) {
            const isUserExist = await userRepository.findUserByEmail(email);

            if (!isUserExist) {
                throw new Error('Invalid credentials');
            }

            if (!isUserExist.otp_enabled) {
                throw new Error('2FA not enabled');
            }

            const isValid = authenticator.check(token, isUserExist.secret);

            if (isValid === null || isValid === undefined || isValid === false) {
                throw new Error('Invalid token');
            }

            const tokenLogin = await generateToken(isUserExist.id);
            return tokenLogin;
        } else if (no_telp) {
            const isUserExist = await userRepository.findUserByNoTelp(no_telp);

            if (!isUserExist) {
                throw new Error('Invalid credentials');
            }

            if (!isUserExist.otp_enabled) {
                throw new Error('2FA not enabled');
            }

            const isValid = authenticator.check(token, isUserExist.secret);

            if (isValid === null || isValid === undefined || isValid === false) {
                throw new Error('Invalid token');
            }

            const tokenLogin = await generateToken(isUserExist.id);
            return tokenLogin;
        }
    },

    async enabled2FA(id) {
        await userRepository.updateUser({ id: id }, {
            otp_enabled: true,
        });
    },
};