const express = require("express");
const userController = require("./user.controller");
const asyncHandler = require("../../middleware/asyncHandler");
const passport = require("../config/passport");
const jwt = require("jsonwebtoken"); // ✅ أضف الـ import
const protect = require("../../middleware/auth").protect;
const router = express.Router();
const {
  forgetPasswordLimiter,
  loginLimiter,
  otpLimiter,
} = require("../../middleware/rateLimiter");

router.post("/register", asyncHandler(userController.register));
router.post("/login", loginLimiter, asyncHandler(userController.login));
router.get("/", asyncHandler(userController.users));
router.get("/verify-email/:token", asyncHandler(userController.verifyEmail));
router.post(
  "/resend-verification",
  asyncHandler(userController.resendVerificationEmail),
);
router.post(
  "/forgot-password",
  forgetPasswordLimiter,
  asyncHandler(userController.forgetPassword),
);
router.post("/reset-password", asyncHandler(userController.resetPassword));
router.post("/verify-otp", otpLimiter, asyncHandler(userController.verifyOtp));

router.post("/refresh-token", asyncHandler(userController.refreshToken));
router.post("/logout", protect, asyncHandler(userController.logout));

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    prompt: "select_account", // ← يفتح نافذة اختيار الحساب دايماً
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=true`,
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.status(200).json({
      success: true,
      data: {
        user: req.user,
        token,
      },
    });
  },
);

module.exports = router;
