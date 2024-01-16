const express = require("express");
const router = express.Router();
const authMiddlewere = require("../middlewares/auth")
const {
    login,
    isAuthenticate,
    register,
    sendOTP,
    verifyOTP,
    sendResetPasswordLink,
    verifyResetPasswordLink
} = require("../controllers/auth.js");

// Auth - Routes

router.post('/login', login)
router.get('/is-authenticate', authMiddlewere, isAuthenticate)

router.post('/register', register)
router.post('/register/send-verification-otp', sendOTP)
router.post('/register/verify-otp', verifyOTP)

// Password - Reset - Routes
router.post('/user/send-reset-password-token', sendResetPasswordLink)
router.post('/user/verify-reset-password-token', verifyResetPasswordLink)

module.exports = router;