require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: '🔐 Reset Password OTP',
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 30px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
    
    <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
      <h2 style="color: white; margin: 0;">Reset Your Password - Astro Truth</h2>
    </div>

    <div style="padding: 30px;">
      <p>Dear ${email || 'User'},</p>

      <p>We received a request to reset your Astro Truth account password.</p>

      <p>Please use the following OTP to reset your password: ${otp} </p>

      <p style="font-size: 24px; font-weight: bold; color: #4CAF50; text-align: center; margin: 30px 0;">${otp}</p>

      <p>This OTP is valid for the next 10 minutes. Do not share it with anyone.</p>

      <p>If you did not request a password reset, please ignore this email or contact our support team immediately.</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://astrotalkproject.vercel.app/reset-password" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
      </div>

      <p>For any assistance, feel free to reach out to us at <a href="mailto:support@astrotruth.com">support@astrotruth.com</a>.</p>

      <p>Stay connected,<br>The Astro Truth Team</p>
    </div>

    <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777;">
      © ${new Date().getFullYear()} Astro Truth. All rights reserved.
    </div>

  </div>
</div>
`
    };

    return transporter.sendMail(mailOptions);
};
