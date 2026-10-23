'use strict';

const crypto = require('crypto');
const config = require('../config');

/**
 * Generate a numeric one-time password (e.g. "042913").
 */
const generateOtp = (length = config.email.otpLength) => {
  const max = 10 ** length;
  return crypto.randomInt(0, max).toString().padStart(length, '0');
};

/**
 * Hash an OTP with an HMAC so raw codes are never stored in the database.
 */
const hashOtp = (otp) =>
  crypto.createHmac('sha256', config.email.otpSecret).update(String(otp)).digest('hex');

/**
 * Constant-time comparison of a submitted OTP against a stored hash.
 */
const verifyOtpHash = (otp, storedHash) => {
  if (!otp || !storedHash) return false;

  const candidate = Buffer.from(hashOtp(otp), 'hex');
  const expected = Buffer.from(storedHash, 'hex');

  if (candidate.length !== expected.length) return false;
  return crypto.timingSafeEqual(candidate, expected);
};

const getOtpExpiry = () =>
  new Date(Date.now() + config.email.otpExpiresMinutes * 60 * 1000);

module.exports = { generateOtp, hashOtp, verifyOtpHash, getOtpExpiry };
