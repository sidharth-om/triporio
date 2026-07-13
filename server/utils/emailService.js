const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Send OTP email to user
 * @param {string} to - recipient email
 * @param {string} otp - 6-digit OTP
 * @param {string} name - user's name
 */
const sendOtpEmail = async (to, otp, name) => {
  const mailOptions = {
    from: `"Triporio" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Your Triporio Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="margin:0;padding:0;background:#0a0f1e;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="480" style="max-width:480px;background:#111827;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
                
                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(135deg,#16a34a,#059669);padding:32px;text-align:center;">
                    <div style="font-size:28px;font-weight:800;color:#fff;letter-spacing:-0.5px;">🌴 Triporio</div>
                    <div style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:4px;">Explore Kerala</div>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px 32px;">
                    <p style="color:#94a3b8;font-size:15px;margin:0 0 8px;">Hi ${name},</p>
                    <h2 style="color:#f1f5f9;font-size:22px;margin:0 0 16px;">Verify your email address</h2>
                    <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 32px;">
                      Use the code below to complete your Triporio registration. This code expires in <strong style="color:#94a3b8;">10 minutes</strong>.
                    </p>

                    <!-- OTP Box -->
                    <div style="background:#0a0f1e;border:2px solid #16a34a;border-radius:12px;padding:24px;text-align:center;margin-bottom:32px;">
                      <div style="letter-spacing:12px;font-size:36px;font-weight:800;color:#4ade80;font-family:monospace;">${otp}</div>
                      <div style="color:#475569;font-size:12px;margin-top:8px;">One-Time Password</div>
                    </div>

                    <p style="color:#475569;font-size:13px;line-height:1.6;margin:0;">
                      If you didn't create a Triporio account, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
                    <p style="color:#334155;font-size:12px;margin:0;">© 2024 Triporio · Kerala Travel Planner</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
