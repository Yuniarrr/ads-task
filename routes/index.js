const express = require('express');
const router = express.Router();
const Validators = require('../middlewares/validator')
const passport = require('passport');
const qr = require('qrcode');
const { authenticator } = require('otplib');

const authController = require('../controllers').auth;
const productController = require('../controllers').product;

const jwtStrategry = require("../strategies/jwt.strategy");
passport.use(jwtStrategry);

router.get('/protected', passport.authenticate("jwt", { session: false }), async (req, res) => {
  return await productController.getAllProduct(req, res);
});

router.post('/auth/login', Validators('login'), authController.login);
router.post('/auth/register', Validators('register'), authController.register);
router.post('/auth/otp/generate', Validators('generateOtp'), authController.generateOtp);
router.post('/auth/otp/verify', Validators('verifyOtp'), authController.verifyOtp);

router.get('/', (req, res) => {
  res.render('inputUrl');
});

router.post('/generateQR', (req, res) => {
  const url = req.body.url;
  res.redirect(`/qrcode/${encodeURIComponent(url)}`);
});

router.get('/qrcode/:url', async (req, res) => {
  try {
    const url = decodeURIComponent(req.params.url);
    const qrImage = await qr.toDataURL(url);
    res.send(`<img src="${qrImage}" alt="QR Code">`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/verify', (req, res) => {
  const { url } = req.body;

  try {
    const token = authenticator.generate(url);
    res.send(`Your 2FA Code is: ${token}`);
  } catch (error) {
    res.status(400).send('Invalid otpauth URL');
  }
});

module.exports = router;
