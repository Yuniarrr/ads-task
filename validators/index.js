const register = require('./register-validator');
const login = require('./login-validator');
const generateOtp = require('./generate-otp-validator');
const verifyOtp = require('./verify-otp-validator');
const profile = require('./profile-validator');

module.exports = {
    register,
    login,
    generateOtp,
    verifyOtp,
    profile,
}