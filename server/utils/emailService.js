const sendOtpEmail = async (to, otp, name) => {
  if (!process.env.BREVO_API_KEY) {
    console.error("BREVO_API_KEY is not set in environment variables.");
    throw new Error("Email service is not configured correctly.");
  }

  // Use the new custom domain for perfect deliverability
  const senderEmail = 'noreply@triporiokerala.com';

  const htmlContent = `
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
  `;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: 'Triporio',
          email: senderEmail
        },
        to: [
          { email: to, name: name }
        ],
        subject: 'Your Triporio Verification Code',
        htmlContent: htmlContent
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API error:', errorData);
      throw new Error('Failed to send email via Brevo');
    }

  } catch (error) {
    console.error('Email send failed:', error);
    throw error;
  }
};

module.exports = { sendOtpEmail };

const sendPasswordResetEmail = async (to, otp, name) => {
  if (!process.env.BREVO_API_KEY) {
    console.error("BREVO_API_KEY is not set in environment variables.");
    throw new Error("Email service is not configured correctly.");
  }

  const senderEmail = 'noreply@triporiokerala.com';

  const htmlContent = `
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
                  <h2 style="color:#f1f5f9;font-size:22px;margin:0 0 16px;">Reset your password</h2>
                  <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 32px;">
                    Use the code below to securely reset your Triporio password. This code expires in <strong style="color:#94a3b8;">10 minutes</strong>.
                  </p>

                  <!-- OTP Box -->
                  <div style="background:#0a0f1e;border:2px solid #16a34a;border-radius:12px;padding:24px;text-align:center;margin-bottom:32px;">
                    <div style="letter-spacing:12px;font-size:36px;font-weight:800;color:#4ade80;font-family:monospace;">${otp}</div>
                    <div style="color:#475569;font-size:12px;margin-top:8px;">Reset Code</div>
                  </div>

                  <p style="color:#475569;font-size:13px;line-height:1.6;margin:0;">
                    If you didn't request a password reset, you can safely ignore this email. Your password will not change.
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
  `;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: 'Triporio',
          email: senderEmail
        },
        to: [
          { email: to, name: name }
        ],
        subject: 'Reset your Triporio Password',
        htmlContent: htmlContent
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API error:', errorData);
      throw new Error('Failed to send email via Brevo');
    }

  } catch (error) {
    console.error('Email send failed:', error);
    throw error;
  }
};

module.exports = { sendOtpEmail, sendPasswordResetEmail };
