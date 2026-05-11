const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 7, // عدد المحولات المسموح بيها
  message: {
    status: "error",
    message: "Too many login attempts, please try again after 15 minutes",
    data: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const forgetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    status: "error",
    message: "Too many requests, please try again after 15 minutes",
    data: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    status: "error",
    message: "Too many OTP attempts, please request a new one",
    data: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter, forgetPasswordLimiter, otpLimiter };
