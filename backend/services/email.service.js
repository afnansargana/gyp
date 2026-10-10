const nodemailer = require("nodemailer");

const isProduction = process.env.NODE_ENV === "production";

/**
 * Builds a Nodemailer transporter.
 * In development, SMTP is optional — OTP is logged / returned by otp.service.
 */
function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

const transporter = createTransporter();

/**
 * Send OTP verification email (signup / future password reset).
 * @param {{ to: string, otp: string, username?: string }} params
 * @returns {Promise<{ sent: boolean, skipped?: boolean, preview?: string }>}
 */
async function sendOtpEmail({ to, otp, username }) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@autofixhub.local";
  const subject = "AutoFixHub — Verify your email";
  const text = [
    `Hi${username ? ` ${username}` : ""},`,
    "",
    `Your AutoFixHub verification code is: ${otp}`,
    "This code expires in 10 minutes.",
    "",
    "If you did not create an account, you can ignore this email.",
  ].join("\n");

  const html = `
    <div style="font-family: 'Segoe UI', system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #0f172a; color: #f1f5f9; border-radius: 16px;">
      <h1 style="font-size: 20px; margin: 0 0 8px; color: #22d3ee;">AutoFixHub</h1>
      <p style="color: #94a3b8; margin: 0 0 20px;">Email verification</p>
      <p style="margin: 0 0 12px;">Hi${username ? ` ${username}` : ""},</p>
      <p style="margin: 0 0 20px;">Use this code to verify your account:</p>
      <p style="font-size: 32px; letter-spacing: 8px; font-weight: 700; text-align: center; margin: 0 0 20px; color: #ecfeff;">${otp}</p>
      <p style="color: #64748b; font-size: 13px; margin: 0;">Expires in 10 minutes. If you did not sign up, ignore this email.</p>
    </div>
  `;

  if (!transporter) {
    console.log(
      `[email.service] SMTP not configured — skipping send (dev). OTP for ${to}: ${otp}`
    );
    return { sent: false, skipped: true };
  }

  try {
    const info = await transporter.sendMail({ from, to, subject, text, html });
    console.log(`[email.service] OTP email sent to ${to}`, info.messageId);
    return { sent: true, preview: info.messageId };
  } catch (error) {
    console.error("[email.service] Failed to send OTP email:", error.message);
    if (!isProduction) {
      console.log(`[email.service] Dev fallback — OTP for ${to}: ${otp}`);
      return { sent: false, skipped: true, error: error.message };
    }
    throw error;
  }
}

module.exports = {
  sendOtpEmail,
  isProduction,
};
