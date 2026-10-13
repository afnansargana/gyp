require("dotenv").config();
const crypto = require("crypto");

function envSecret(name, bytes = 32) {
  if (process.env[name]) return process.env[name];
  if (process.env.NODE_ENV === "production") {
    throw new Error(`${name} must be set in production`);
  }
  console.warn(`[config] ${name} missing — using a dev-only fallback`);
  return crypto.randomBytes(bytes).toString("hex");
}

module.exports = {
  secretKey: envSecret("JWT_SECRET"),
  refreshSecret: envSecret("JWT_REFRESH_SECRET"),
  accessTtl: process.env.JWT_ACCESS_TTL || "15m",
  refreshTtl: process.env.JWT_REFRESH_TTL || "7d",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3001",
};
