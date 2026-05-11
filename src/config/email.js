const nodemailer = require("nodemailer");

// create transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// function to send verification email
const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.BASE_URL}/api/users/verify-email/${token}`;
  await transporter.sendMail({
    from: '"My App" <no-reply@myapp.com>',
    to: email,
    subject: "Verify Your Email",
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Welcome! 👋</h2>
        <p>Please verify your email by clicking the button below:</p>
        <a href="${verifyUrl}"
           style="background:#4ADE80; color:white; padding:12px 24px;
                  text-decoration:none; border-radius:6px; display:inline-block;">
          Verify Email
        </a>
        <p style="color:#999; margin-top:16px;">
          This link expires in 24 hours.
        </p>
      </div>
    `,
  });
};

// function to send otp with email
const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: '"My App" <no-reply@myapp.com>',
    to: email,
    subject: "Reset Your Password",

    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Reset Password 🔑</h2>
        <p>Your OTP code is:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px;
                    color: #4ADE80; padding: 20px; background: #1E293B;
                    text-align: center; border-radius: 8px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color:#999;">This code expires in <b>10 minutes</b>.</p>
        <p style="color:#999;">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};

module.exports = { sendVerificationEmail, sendOtpEmail };
