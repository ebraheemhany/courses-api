const userRepo = require("./user.Repo");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendVerificationEmail, sendOtpEmail } = require("../config/email");
const { time } = require("console");
class userService {
  async register(data) {
    console.log("🔥 REGISTER STARTED");

    const userExist = await userRepo.findByEmail(data.email);
    if (userExist) {
      const err = new Error("user already exist");
      err.statusCode = 409;
      throw err;
    }

    const hashPassword = await bcrypt.hash(data.password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const createUser = await userRepo.create({
      ...data,
      password: hashPassword,
      verificationToken,
      isVerified: false,
    });

    console.log("🔥 USER CREATED");

    try {
      await sendVerificationEmail(createUser.email, verificationToken);
      console.log("✅ EMAIL SENT");
    } catch (err) {
      console.log("❌ EMAIL ERROR:", err);
    }

    return {
      message:
        "Registration successful! Please check your email to verify your account.",
    };
  }

  // ⑥ دالة جديدة للـ verify
  async verifyEmail(token) {
    const user = await userRepo.findByVerificationToken(token);

    if (!user) {
      const err = new Error("Invalid or expired verification token");
      err.statusCode = 400;
      throw err;
    }

    if (user.isVerified) {
      const err = new Error("Email already verified");
      err.statusCode = 400;
      throw err;
    }

    // فعّل الحساب واحذف الـ token
    await userRepo.updateById(user._id, {
      isVerified: true,
      verificationToken: null,
    });

    return { message: "Email verified successfully! You can now login." };
  }

  async login(data) {
    const user = await userRepo.findByEmail(data.email);

    if (!user) {
      throw new Error("invalid email or password");
    }

    // ⑦ منع الـ unverified users
    if (!user.isVerified) {
      const err = new Error("Please verify your email first");
      err.statusCode = 403;
      throw err;
    }

    //   compare password
    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new Error("invalid email or password");
    }
    //  create access token
    const AccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }, // ACCESS TOKEN will expire in 15 minutes
    );

    // create refresh token
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }, // refresh token will be espire in 7 days
    );
    // save refresh token in database
    await userRepo.updateById(user._id, { refreshToken });

    const { password, ...userObj } = user.toObject();

    return {
      user: userObj,
      AccessToken,
      refreshToken,
    };
  }

  // ✅ دالة تجديد الـ Access Token
  async refreshToken(token) {
    if (!token) {
      const err = new Error("Refresh token required");
      err.statusCode = 401;
      throw err;
    }

    // تحقق من الـ token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      const err = new Error("Invalid or expired refresh token");
      err.statusCode = 401;
      throw err;
    }

    // تأكد إنه موجود في الـ DB
    const user = await userRepo.findByRefreshToken(token);
    if (!user) {
      const err = new Error("Refresh token not found");
      err.statusCode = 401;
      throw err;
    }

    // ننشئ Access Token جديد
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    return { accessToken };
  }

  // ✅ دالة الـ Logout
  async logout(userId) {
    await userRepo.updateById(userId, { refreshToken: null });
    return { message: "Logged out successfully" };
  }

  async users() {
    const users = await userRepo.users();
    return users;
  }

  async resendVerificationEmail(email) {
    // get user by email
    const user = await userRepo.findByEmail(email);
    // check if user not exist
    if (!user) {
      const err = new Error("Email not found");
      err.statusCode = 404;
      throw err;
    }
    // check if user is already verified
    if (user.isVerified) {
      const err = new Error("Email already verified");
      err.statusCode = 400;
      throw err;
    }

    // create new token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    // update user with new token
    await userRepo.updateById(user._id, { verificationToken });
    // send a new email
    await sendVerificationEmail(user.email, verificationToken);
    //  final message
    return { message: "Verification email sent! Please check your inbox." };
  }

  // send otp
  async forgotPassword(email) {
    const user = await userRepo.findByEmailWithOtp(email);

    if (!user) {
      const err = new Error("email not found");
      err.statusCode = 400;
      throw err;
    }

    if (!user.isVerified) {
      const err = new Error("Please verify your email first");
      err.statusCode = 403;
      throw err;
    }

    // create otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // create otp expiration time
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from current time

    // save otp and expiration time in db
    await userRepo.updateById(user._id, { resetOtp: otp, otpExpires });

    // send otp with email
    await sendOtpEmail(user.email, otp);

    return { message: "OTP sent! Please check your email." };
  }

  // ceck otp and change password
  async resetPassword(email, otp, newPassword) {
    const user = await userRepo.findByEmailWithOtp(email);

    if (!user) {
      const err = new Error("email not found");
      err.statusCode = 400;
      throw err;
    }

    // check is otp valid
    if (user.resetOtp !== otp) {
      const err = new Error("invalid otp");
      err.statusCode = 400;
      throw err;
    }

    // check otp expiration time
    if (user.otpExpires < new Date()) {
      const err = new Error("OTP expired, please request a new one");
      err.statusCode = 400;
      throw err;
    }

    // hash new password
    const hashPassword = await bcrypt.hash(newPassword, 10);

    //update password and remove otp
    await userRepo.updateById(user._id, {
      password: hashPassword,
      resetOtp: null,
      otpExpires: null,
    });

    return { message: "Password reset successfully! You can now login." };
  }
}

module.exports = new userService();
