const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // verification filed to email
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, select: false },

    // for rest password otp
    resetOtp: { type: String, select: false },
    otpExpires: { type: Date, select: false },

    // for google auth
    googleId: { type: String, select: false },

    // for refresh token
    refreshToken: { type: String, select: false },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
