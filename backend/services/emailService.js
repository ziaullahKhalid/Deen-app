const nodemailer = require('nodemailer');

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || 'deenappotp@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || '';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false, // TLS on port 587
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

function buildOTPEmailHTML(otp) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="420" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0D3B0F,#1B5E20);padding:32px 24px;text-align:center;">
              <div style="width:56px;height:56px;margin:0 auto 12px;background:linear-gradient(135deg,#D4AF37,#F5E6B8,#D4AF37);border-radius:50%;line-height:56px;font-size:28px;">🌙</div>
              <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;letter-spacing:0.5px;">Deen App</h1>
              <p style="color:#A5D6A7;margin:6px 0 0;font-size:13px;">Your Faith, Your Community</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 28px;">
              <h2 style="color:#1B5E20;margin:0 0 8px;font-size:20px;font-weight:600;">Verification Code</h2>
              <p style="color:#666;margin:0 0 24px;font-size:14px;line-height:1.5;">
                Assalamu Alaikum! Use the following code to verify your email address. This code is valid for <strong>5 minutes</strong>.
              </p>
              <!-- OTP Box -->
              <div style="background-color:#F1F8E9;border:2px solid #1B5E20;border-radius:12px;padding:20px;text-align:center;margin:0 0 24px;">
                <span style="font-size:36px;font-weight:800;letter-spacing:12px;color:#1B5E20;font-family:monospace;">${otp}</span>
              </div>
              <p style="color:#999;margin:0 0 8px;font-size:12px;line-height:1.5;">
                ⚠️ This code expires in <strong>5 minutes</strong>. Do not share it with anyone.
              </p>
              <p style="color:#999;margin:0;font-size:12px;line-height:1.5;">
                If you did not request this code, please ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f9f9f9;padding:20px 28px;text-align:center;border-top:1px solid #eee;">
              <p style="color:#aaa;margin:0;font-size:11px;">
                &copy; ${new Date().getFullYear()} Deen App. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function sendOTPEmail(toEmail, otp) {
  if (!SMTP_PASS) {
    console.log(`[DEV MODE] OTP for ${toEmail}: ${otp}`);
    return { success: true, devMode: true };
  }

  const mailOptions = {
    from: `"Deen App" <${SMTP_USER}>`,
    to: toEmail,
    subject: `${otp} is your Deen App verification code`,
    html: buildOTPEmailHTML(otp),
    text: `Your Deen App verification code is: ${otp}\n\nThis code expires in 5 minutes. Do not share it with anyone.\n\nIf you did not request this code, please ignore this email.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (err) {
    console.error('Email send error:', err.message);
    return { success: false, error: 'Failed to send verification email. Please try again.' };
  }
}

module.exports = { sendOTPEmail };
