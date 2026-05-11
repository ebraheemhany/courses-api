const userService = require("./user.serves");

class userController {
  async register(req, res) {
    const user = await userService.register(req.body);
    res.status(201).json({ success: true, data: user });
  }

  async login(req, res) {
    const login = await userService.login(req.body, req.body.password);
    res.status(200).json({ success: true, data: login });
  }

  async users(req, res) {
    const users = await userService.users();
    res.status(200).json({ success: true, data: users });
  }

  async verifyEmail(req, res) {
    const { token } = req.params;
    const verification = await userService.verifyEmail(token);
    res.status(200).json({ success: true, data: verification });
  }

  async resendVerificationEmail(req, res) {
    const { email } = req.body;
    const resend = await userService.resendVerificationEmail(email);
    res.status(200).json({ success: true, data: resend });
  }

  async forgetPassword(req, res) {
    const { email } = req.body;
    const forget = await userService.forgotPassword(email);
    res.status(200).json({ success: true, data: forget });
  }

  async resetPassword(req, res) {
    const { email, otp, newPassword } = req.body;
    const reset = await userService.resetPassword(email, otp, newPassword);
    res.status(200).json({ success: true, data: reset });
  }

async refreshToken(req, res) {
  const { refreshToken } = req.body;
  const result = await userService.refreshToken(refreshToken);
  res.status(200).json({ success: true, data: result });
}

async logout(req, res) {
  const result = await userService.logout(req.user.id);
  res.status(200).json({ success: true, data: result });
}



}
module.exports = new userController();
