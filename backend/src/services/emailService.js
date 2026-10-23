'use strict';

const config = require('../config');

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const getEmailContent = ({ firstName, otp, purpose }) => {
  const isReset = purpose === 'reset-password';
  const name = escapeHtml(firstName || 'there');
  const expires = config.email.otpExpiresMinutes;

  const subject = isReset
    ? 'Your CareBridge password reset code'
    : 'Verify your CareBridge email address';

  const heading = isReset ? 'Reset your password' : 'Verify your email address';

  const intro = isReset
    ? `Hi ${name}, we received a request to reset the password for your CareBridge account. Use the code below to choose a new password.`
    : `Hi ${name}, welcome to CareBridge Specialist Hospital. Use the code below to verify your email address and activate your account.`;

  const footerNote = isReset
    ? 'If you did not request a password reset, you can safely ignore this email. Your password will not change.'
    : 'If you did not create a CareBridge account, you can safely ignore this email.';

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f7f6;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f7f6;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="background-color:#0f766e;padding:28px 32px;">
                <div style="font-size:22px;font-weight:bold;color:#ffffff;letter-spacing:0.3px;">CareBridge</div>
                <div style="font-size:12px;color:#ccfbf1;margin-top:4px;">Specialist Hospital</div>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px 8px 32px;">
                <h1 style="margin:0 0 16px 0;font-size:24px;line-height:1.3;color:#111827;">${heading}</h1>
                <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:#4b5563;">${intro}</p>
                <div style="text-align:center;margin:28px 0;">
                  <div style="display:inline-block;background-color:#f0fdfa;border:1px solid #99f6e4;border-radius:12px;padding:16px 28px;font-size:34px;letter-spacing:10px;font-weight:bold;color:#0f766e;">
                    ${otp}
                  </div>
                </div>
                <p style="margin:0 0 8px 0;font-size:14px;line-height:1.6;color:#4b5563;text-align:center;">
                  This code expires in <strong>${expires} minutes</strong>.
                </p>
                <p style="margin:0;font-size:13px;line-height:1.6;color:#9ca3af;text-align:center;">
                  Never share this code with anyone. CareBridge staff will never ask you for it.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 32px 32px;">
                <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 20px 0;" />
                <p style="margin:0;font-size:12px;line-height:1.6;color:#9ca3af;">${footerNote}</p>
                <p style="margin:12px 0 0 0;font-size:12px;line-height:1.6;color:#9ca3af;">
                  CareBridge Specialist Hospital, Jos, Nigeria
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const textContent = [
    `CareBridge Specialist Hospital`,
    '',
    heading,
    '',
    isReset
      ? `Hi ${firstName || 'there'}, we received a request to reset the password for your CareBridge account.`
      : `Hi ${firstName || 'there'}, welcome to CareBridge Specialist Hospital.`,
    `Your verification code is: ${otp}`,
    `This code expires in ${expires} minutes.`,
    '',
    footerNote,
  ].join('\n');

  return { subject, htmlContent, textContent };
};

/**
 * Send an OTP email through Brevo's transactional email API.
 * Returns { delivered, devLogged }.
 */
const sendOtpEmail = async ({ to, firstName, otp, purpose = 'verify-email' }) => {
  const { subject, htmlContent, textContent } = getEmailContent({ firstName, otp, purpose });

  if (!config.email.brevoApiKey) {
    if (config.nodeEnv !== 'production') {
      console.log(`\n[email] BREVO_API_KEY is not configured. OTP for ${to} (${purpose}): ${otp}\n`);
      return { delivered: false, devLogged: true };
    }
    throw new Error('Email service is not configured (BREVO_API_KEY missing)');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'api-key': config.email.brevoApiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: config.email.senderName,
          email: config.email.senderEmail,
        },
        replyTo: config.email.replyToEmail
          ? { email: config.email.replyToEmail }
          : undefined,
        to: [{ email: to, name: firstName || to }],
        subject,
        htmlContent,
        textContent,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Brevo API error (${response.status}): ${body}`);
    }

    return { delivered: true, devLogged: false };
  } finally {
    clearTimeout(timeout);
  }
};

module.exports = { sendOtpEmail };
