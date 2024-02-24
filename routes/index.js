const express = require('express');
const router = express.Router();
const Validators = require('../middlewares/validator')
const passport = require('passport');

const authController = require('../controllers').auth;
const productController = require('../controllers').product;

const jwtStrategry = require("../strategies/jwt.strategy");
passport.use(jwtStrategry);

router.get('/protected', passport.authenticate("jwt", { session: false }), async (req, res) => {
  return await productController.getAllProduct(req, res);
});

router.post('/auth/login', Validators('login'), authController.login);
router.post('/auth/register', Validators('register'), authController.register);

module.exports = router;
