const User = require("./user.module");

class userRepo {
  create(data) {
    return User.create(data);
  }

  findByEmail(email) {
    return User.findOne({ email }).select("+password"); // ✅ أضف هذا
  }
  users() {
    return User.find().select("-password");
  }

  // get user by token
  findByVerificationToken(token) {
    return User.findOne({ verificationToken: token }).select(
      "+verificationToken",
    );
  }
  // ① مهم — بتستخدمه لما تفعّل الحساب
  updateById(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true }).select("-password");
  }

  // ② مهم — بتستخدمه في getById
  findById(id) {
    return User.findById(id).select("-password");
  }

  // reset password
  findByEmailWithOtp(email) {
    return User.findOne({ email }).select(" +password +resetOtp +otpExpires");
  }
// find user by refresh token
findByRefreshToken(token) {
  return User.findOne({ refreshToken: token }).select("+refreshToken");
}


}

module.exports = new userRepo();
