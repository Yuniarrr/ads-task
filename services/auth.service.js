const User = require('../models').User;
const generateToken = require('../utils/generate-token')
const userService = require('../services/user.service');
const hashPassword = require('../utils/hash-password');
const bcryptjs = require('bcryptjs')

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
            no_telp: no_telp,
        }).then(user => {
            return res.status(201).json({
                id: user.id,
                username: user.username,
                email: user.email,
                no_telp: user.no_telp,
            })
        }).catch(error => {
            return res.status(400).send(error);
        });
    },

    async login(req, res) {
        const { email, password } = req.body;

        User.findOne({ where: { email: email } })
            .then((user) => {
                if (user) {
                    bcryptjs.compare(password, user.password, async (err, result) => {
                        if (result) {
                            const token = await generateToken(user.id, user.email);
                            return res.status(200).send({ token });
                        } else {
                            return res.status(401).send({ message: 'Invalid credentials' });
                        }
                    });
                } else {
                    return res.status(401).send({ message: 'Invalid credentials' });
                }
            }).catch(error => {
                return res.status(400).send(error);
            })
    },
};