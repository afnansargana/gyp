const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { secretKey, refreshSecret, accessTtl, refreshTtl } = require("../config");

function isProd() {
  return process.env.NODE_ENV === "production";
}

function cookieBase() {
  return {
    httpOnly: true,
    secure: isProd(),
    sameSite: isProd() ? "none" : "lax",
    path: "/",
  };
}

function signAccessToken(user) {
  const role = user.isAdmin ? "admin" : user.isMechanic ? "mechanic" : "customer";
  return jwt.sign(
    {
      userId: user._id,
      isAdmin: !!user.isAdmin,
      isMechanic: !!user.isMechanic,
      role,
      typ: "access",
    },
    secretKey,
    { expiresIn: accessTtl }
  );
}

function signRefreshToken(user, jti) {
  return jwt.sign(
    {
      userId: user._id,
      jti,
      typ: "refresh",
    },
    refreshSecret,
    { expiresIn: refreshTtl }
  );
}

function hashToken(raw) {
  return bcrypt.hash(raw, 10);
}

function compareToken(raw, hash) {
  return bcrypt.compare(raw, hash);
}

function newJti() {
  return crypto.randomBytes(16).toString("hex");
}

function setAuthCookies(res, { accessToken, refreshToken }) {
  res.cookie("accessToken", accessToken, {
    ...cookieBase(),
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    ...cookieBase(),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearAuthCookies(res) {
  res.clearCookie("accessToken", cookieBase());
  res.clearCookie("refreshToken", cookieBase());
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  hashToken,
  compareToken,
  newJti,
  setAuthCookies,
  clearAuthCookies,
};
