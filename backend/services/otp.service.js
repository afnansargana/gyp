const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendOtpEmail, isProduction } = require("./email.service");

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES) || 10;
const RESEND_COOLDOWN_MS = 60 * 1000;

/**
 * Generate a numeric OTP string.
 */
function generateOtp(length = OTP_LENGTH) {
  const max = 10 ** length;
  const num = crypto.randomInt(0, max);
  return String(num).padStart(length, "0");
}

async function hashOtp(otp) {
  return bcrypt.hash(otp, 10);
}

async function compareOtp(otp, hash) {
  if (!hash) return false;
  return bcrypt.compare(otp, hash);
}

/**
 * Issue OTP onto a user document, email it, and return a safe payload for the API.
 * @param {import('mongoose').Document} user
 * @returns {Promise<{ email: string, expiresAt: Date, otp?: string, emailResult: object }>}
 */
async function issueOtp(user) {
  const otp = generateOtp();
  const otpHash = await hashOtp(otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  user.otpHash = otpHash;
  user.otpExpiresAt = expiresAt;
  user.otpLastSentAt = new Date();
  await user.save();

  console.log(
    `[otp.service] OTP generated for ${user.email} (expires ${expiresAt.toISOString()})`
  );
  if (!isProduction) {
    console.log(`[otp.service] DEV OTP → ${otp}`);
  }

  const emailResult = await sendOtpEmail({
    to: user.email,
    otp,
    username: user.username,
  });

  const payload = {
    email: user.email,
    expiresAt,
    emailResult,
  };

  // Enterprise architecture in place; expose OTP only outside production for demos.
  if (!isProduction) {
    payload.otp = otp;
  }

  return payload;
}

/**
 * @param {import('mongoose').Document} user
 * @returns {{ allowed: boolean, retryAfterMs?: number }}
 */
function canResendOtp(user) {
  if (!user.otpLastSentAt) return { allowed: true };
  const elapsed = Date.now() - new Date(user.otpLastSentAt).getTime();
  if (elapsed >= RESEND_COOLDOWN_MS) return { allowed: true };
  return { allowed: false, retryAfterMs: RESEND_COOLDOWN_MS - elapsed };
}

/**
 * Validate OTP and clear fields on success.
 * @returns {Promise<{ ok: boolean, reason?: string }>}
 */
async function verifyUserOtp(user, otp) {
  if (user.isVerified && !user.otpHash) {
    return { ok: false, reason: "already_verified" };
  }

  if (!user.otpHash || !user.otpExpiresAt) {
    return { ok: false, reason: "no_otp" };
  }

  if (new Date() > new Date(user.otpExpiresAt)) {
    return { ok: false, reason: "expired" };
  }

  const match = await compareOtp(String(otp).trim(), user.otpHash);
  if (!match) {
    return { ok: false, reason: "invalid" };
  }

  user.isVerified = true;
  user.otpHash = null;
  user.otpExpiresAt = null;
  await user.save();

  return { ok: true };
}

module.exports = {
  generateOtp,
  issueOtp,
  canResendOtp,
  verifyUserOtp,
  OTP_EXPIRY_MINUTES,
  RESEND_COOLDOWN_MS,
};
