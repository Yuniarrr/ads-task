const express = require('express');
const router = express.Router();
const Validators = require('../middlewares/validator')
const passport = require('passport');
const qr = require('qrcode');

const authController = require('../controllers').auth;
const productController = require('../controllers').product;
const userController = require('../controllers').user;

const fileService = require('../services').fileService;

const jwtStrategry = require("../strategies/jwt.strategy");
passport.use(jwtStrategry);

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

router.get('/protected', passport.authenticate("jwt", { session: false }), async (req, res) => {
  return await productController.getAllProduct(req, res);
});

router.post('/auth/login', Validators('login'), authController.login);
router.post('/auth/register', Validators('register'), authController.register);
router.post('/auth/otp/generate', Validators('generateOtp'), authController.generateOtp);
router.post('/auth/otp/verify', Validators('verifyOtp'), authController.verifyOtp);
router.get('/auth/2fa/enable', passport.authenticate("jwt", { session: false }), authController.enabled2FA);

router.patch('/user', passport.authenticate("jwt", { session: false }), upload.single('image'), userController.updateUser);
router.get('/user/me', passport.authenticate("jwt", { session: false }), userController.findUserById);

router.get('/uploads/:filename', fileService.getFile);

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

module.exports = router;
