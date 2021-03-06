const express = require('express');
const router = express();
const AuthController = require('../Controllers/auth-controllers')
const ForgotPasswordController = require("../Controllers/forgotPassword-controller")
let { requireAuth } = require("../middlewares/userMiddleware");

router.post("/register",AuthController.register)
router.post("/login",AuthController.login)
router.get("/verify/:uniqueString",AuthController.verifymail)
router.post("/isAdmin",requireAuth,AuthController.isAdmin)


router.post("/forgot-password", ForgotPasswordController.checkSapId)
router.post("/check-otp", ForgotPasswordController.checkOtp)
router.post("/change-password", ForgotPasswordController.changePassword)

module.exports = router;