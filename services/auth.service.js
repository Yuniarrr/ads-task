const User = require('../models').User;
const generateToken = require('../utils/generate-token')
const userService = require('../services/user.service');
const hashPassword = require('../utils/hash-password');
const bcryptjs = require('bcryptjs')
const speakeasy = require('speakeasy');
const OTPAuth = require('otpauth');
const { totp } = require('otplib')

module.exports = {
    async register(req, res) {
        const { username, email, password, no_telp } = req.body;

        if (email) {
            const user = await userService.findUserByEmail(email);
            if (user) {
                return res.status(400).send({ message: 'Email already exists' });
            }
        } else if (no_telp) {
            const user = await userService.findUserByNoTelp(no_telp);
            if (user) {
                return res.status(400).send({ message: 'No telp already exists' });
            }
        }

        const hashedPassword = await hashPassword(password);

        return User.create({
            username: username,
            email: email,
            password: hashedPassword,
            no_telp: no_telp
        }).then(user => {
            return res.status(201).json({
                id: user.id,
                username: user.username,
                email: user.email,
                no_telp: user.no_telp,
            })
        }).catch(error => {
            return res.status(400).json({ error: error.message });
        });
    },

    async loginWithPassword(req, res) {
        const { email, password } = req.body;

        User.findOne({ where: { email: email } })
            .then((user) => {
                if (user) {
                    bcryptjs.compare(password, user.password, async (err, result) => {
                        if (result) {
                            const token = await generateToken(user.id);
                            return res.status(200).send({ token });
                        } else {
                            return res.status(401).send({ message: 'Invalid credentials' });
                        }
                    });
                } else {
                    return res.status(401).send({ message: 'Invalid credentials' });
                }
            }).catch(error => {
                return res.status(400).json({ error: error.message });
            })
    },

    async generateOtp(req, res) {
        const { email, no_telp } = req.body;
        const secret = speakeasy.generateSecret({ google_auth_qr: true, qr_codes: true });
        const token_otp = new OTPAuth.TOTP({
            issuer: "codevoweb.com",
            label: "CodevoWeb",
            algorithm: 'SHA1',
            digits: 6,
            // period: 300,
            secret: secret.base32,
        });
        console.log("in generateOtp", secret.base32);
        const otp_url = token_otp.toString();

        if (email) {
            User.findOne({ where: { email: email } })
                .then(async (user) => {
                    if (user) {
                        await User.update({
                            otp_hex: secret.qr_code_hex,
                            otp_base32: secret.qr_code_base32,
                            otp_ascii: secret.qr_code_ascii,
                            otp_auth_url: otp_url,
                            secret: secret.base32,
                        }, {
                            where: { email: email }
                        }).then(() => {
                            return res.status(200).send({
                                ...secret
                            });
                        }).catch(error => {
                            return res.status(400).json({ error: error.message });
                        });
                    } else {
                        return res.status(401).send({ message: 'Invalid credentials' });
                    }
                }).catch(error => {
                    return res.status(400).json({ error: error.message });
                })
        } else if (no_telp) {
            User.findOne({ where: { no_telp: no_telp } })
                .then((user) => {
                    if (user) {
                        User.update({
                            otp_hex: secret.hex,
                            otp_base32: secret.base32,
                            otp_ascii: secret.ascii,
                            otp_auth_url: otp_url,
                        }, {
                            where: { no_telp: no_telp }
                        }).then(() => {
                            return res.status(200).send({
                                ...secret
                            });
                        }).catch(error => {
                            return res.status(400).json({ error: error.message });
                        });
                    } else {
                        return res.status(401).send({ message: 'Invalid credentials' });
                    }
                }).catch(error => {
                    return res.status(400).json({ error: error.message });
                })
        }
    },

    async verifyOtp(req, res) {
        const { email, no_telp, token } = req.body;

        if (email) {
            User.findOne({ where: { email: email } })
                .then(async (user) => {
                    if (user) {
                        const token_otp = new OTPAuth.TOTP({
                            issuer: "codevoweb.com",
                            label: "CodevoWeb",
                            algorithm: 'SHA1',
                            digits: 6,
                            // period: 300,
                            secret: user.secret,
                        });
                        console.log("in verifyOtp", user.secret);
                        console.log('token', token);
                        let isValid = token_otp.validate({ token: token });

                        console.log("isValid", isValid);

                        if (isValid === null) {
                            return res.status(401).json({
                                message: 'Invalid token'
                            });
                        }

                        User.update({
                            otp_hex: null,
                            otp_base32: null,
                            otp_ascii: null,
                            otp_auth_url: null,
                        }, {
                            where: { email: email }
                        });

                        const tokenLogin = await generateToken(user.id);
                        return res.status(200).send({ token: tokenLogin });
                    } else {
                        return res.status(401).send({ message: 'Invalid credentials' });
                    }
                }).catch(error => {
                    console.log(error);
                    return res.status(400).json({ error: error.message });
                });
        } else if (no_telp) {
            User.findOne({ where: { no_telp: no_telp } })
                .then(async (user) => {
                    if (user) {
                        const token_otp = new OTPAuth.TOTP({
                            algorithm: 'SHA1',
                            digits: 6,
                            period: 300,
                            secret: user.otp_base32,
                        });
                        console.log('token', token);
                        let isValid = token_otp.validate({ token: token });

                        if (isValid === null) {
                            return res.status(401).json({
                                message: 'Invalid token'
                            });
                        }

                        User.update({
                            otp_hex: null,
                            otp_base32: null,
                            otp_ascii: null,
                            otp_auth_url: null,
                        }, {
                            where: { no_telp: no_telp }
                        });

                        const tokenLogin = await generateToken(user.id);
                        return res.status(200).send({ token: tokenLogin });
                    } else {
                        return res.status(401).send({ message: 'Invalid credentials' });
                    }
                }).catch(error => {
                    console.log(error);
                    return res.status(400).json({ error: error.message });
                });
        }
    }
};