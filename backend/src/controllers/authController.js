'use strict';

const bcrypt = require('bcryptjs');
const { User, Patient, RefreshToken } = require('../models');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, getRefreshTokenExpiry } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');
const { generateOtp, hashOtp, verifyOtpHash, getOtpExpiry } = require('../utils/otp');
const { sendOtpEmail } = require('../services/emailService');
const config = require('../config');
const { sequelize } = require('../models');

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const resendCooldownMs = config.email.resendCooldownSeconds * 1000;

const isWithinCooldown = (lastSentAt) =>
  Boolean(lastSentAt) && Date.now() - new Date(lastSentAt).getTime() < resendCooldownMs;

const createSession = async (user, res, message) => {
  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  await RefreshToken.create({
    userId: user.id,
    token: refreshToken,
    expiresAt: getRefreshTokenExpiry(),
  });

  res.cookie(config.jwt.refreshCookieName, refreshToken, cookieOptions);

  return sendSuccess(res, { user: user.toJSON(), accessToken }, message);
};

const issueEmailVerification = async (user) => {
  if (isWithinCooldown(user.emailVerificationLastSentAt)) {
    return { sent: false, reason: 'cooldown' };
  }

  const otp = generateOtp();

  await user.update({
    emailVerificationOtpHash: hashOtp(otp),
    emailVerificationOtpExpiresAt: getOtpExpiry(),
    emailVerificationAttempts: 0,
    emailVerificationLastSentAt: new Date(),
  });

  try {
    const result = await sendOtpEmail({
      to: user.email,
      firstName: user.firstName,
      otp,
      purpose: 'verify-email',
    });
    return { sent: result.delivered || result.devLogged };
  } catch (error) {
    console.error('[email] Failed to send verification email:', error.message);
    return { sent: false, reason: 'send_failed' };
  }
};

const issuePasswordReset = async (user) => {
  if (isWithinCooldown(user.passwordResetLastSentAt)) {
    return { sent: false, reason: 'cooldown' };
  }

  const otp = generateOtp();

  await user.update({
    passwordResetOtpHash: hashOtp(otp),
    passwordResetOtpExpiresAt: getOtpExpiry(),
    passwordResetAttempts: 0,
    passwordResetLastSentAt: new Date(),
  });

  try {
    const result = await sendOtpEmail({
      to: user.email,
      firstName: user.firstName,
      otp,
      purpose: 'reset-password',
    });
    return { sent: result.delivered || result.devLogged };
  } catch (error) {
    console.error('[email] Failed to send password reset email:', error.message);
    return { sent: false, reason: 'send_failed' };
  }
};

const register = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const existing = await User.findOne({ where: { email: normalizedEmail } });
    if (existing) {
      await t.rollback();

      if (existing.isEmailVerified) {
        return sendError(res, 'Email address is already registered', 409);
      }

      const { sent } = await issueEmailVerification(existing);

      return sendSuccess(
        res,
        { email: existing.email, requiresEmailVerification: true, emailSent: sent },
        'This email is already registered but not verified. A new verification code has been sent.',
        200
      );
    }

    const passwordHash = await bcrypt.hash(password, config.bcrypt.rounds);
    const otp = generateOtp();

    const user = await User.create(
      {
        firstName,
        lastName,
        email: normalizedEmail,
        phone,
        passwordHash,
        role: 'patient',
        isEmailVerified: false,
        emailVerificationOtpHash: hashOtp(otp),
        emailVerificationOtpExpiresAt: getOtpExpiry(),
        emailVerificationAttempts: 0,
        emailVerificationLastSentAt: new Date(),
      },
      { transaction: t }
    );

    // Auto-create patient profile
    await Patient.create({ userId: user.id }, { transaction: t });

    await t.commit();

    let emailSent = false;
    try {
      const result = await sendOtpEmail({
        to: user.email,
        firstName: user.firstName,
        otp,
        purpose: 'verify-email',
      });
      emailSent = result.delivered || result.devLogged;
    } catch (error) {
      console.error('[email] Failed to send verification email:', error.message);
    }

    return sendSuccess(
      res,
      { email: user.email, requiresEmailVerification: true, emailSent },
      'Registration successful. Check your email for the verification code.',
      201
    );
  } catch (error) {
    if (!t.finished) await t.rollback();
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (!user) {
      return sendError(res, 'Invalid verification code', 400, 'INVALID_OTP');
    }

    if (user.isEmailVerified) {
      return sendError(res, 'Email is already verified. You can sign in.', 400, 'ALREADY_VERIFIED');
    }

    if (!user.emailVerificationOtpHash || !user.emailVerificationOtpExpiresAt) {
      return sendError(res, 'No verification code found. Please request a new one.', 400, 'OTP_NOT_FOUND');
    }

    if (new Date() > new Date(user.emailVerificationOtpExpiresAt)) {
      await user.update({
        emailVerificationOtpHash: null,
        emailVerificationOtpExpiresAt: null,
        emailVerificationAttempts: 0,
      });
      return sendError(res, 'This verification code has expired. Please request a new one.', 400, 'OTP_EXPIRED');
    }

    if (user.emailVerificationAttempts >= config.email.maxAttempts) {
      return sendError(res, 'Too many incorrect attempts. Please request a new code.', 429, 'TOO_MANY_ATTEMPTS');
    }

    if (!verifyOtpHash(otp, user.emailVerificationOtpHash)) {
      const attempts = user.emailVerificationAttempts + 1;
      await user.update({ emailVerificationAttempts: attempts });

      const remaining = Math.max(0, config.email.maxAttempts - attempts);
      return sendError(
        res,
        remaining > 0
          ? `Incorrect verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
          : 'Too many incorrect attempts. Please request a new code.',
        400,
        'INVALID_OTP'
      );
    }

    await user.update({
      isEmailVerified: true,
      emailVerificationOtpHash: null,
      emailVerificationOtpExpiresAt: null,
      emailVerificationAttempts: 0,
      emailVerificationLastSentAt: null,
      lastLoginAt: new Date(),
    });

    return createSession(user, res, 'Email verified successfully');
  } catch (error) {
    next(error);
  }
};

const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (user && !user.isEmailVerified) {
      await issueEmailVerification(user);
    }

    // Generic response prevents email enumeration
    return sendSuccess(
      res,
      null,
      'If your account still needs verification, a new code has been sent.'
    );
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      return sendError(res, 'Invalid email or password', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'Your account has been deactivated. Please contact support.', 403);
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return sendError(res, 'Invalid email or password', 401);
    }

    if (!user.isEmailVerified) {
      return sendError(
        res,
        'Please verify your email address before signing in. Check your inbox for the verification code.',
        403,
        'EMAIL_NOT_VERIFIED'
      );
    }

    // Update last login
    await user.update({ lastLoginAt: new Date() });

    // Clean up old refresh tokens for this user (keep last 5)
    const tokens = await RefreshToken.findAll({
      where: { userId: user.id },
      order: [['createdAt', 'DESC']],
    });
    if (tokens.length >= 5) {
      const toDelete = tokens.slice(4).map((t) => t.id);
      await RefreshToken.destroy({ where: { id: toDelete } });
    }

    return createSession(user, res, 'Login successful');
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const token = req.cookies[config.jwt.refreshCookieName];
    if (!token) {
      return sendError(res, 'Refresh token not found', 401);
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch (err) {
      res.clearCookie(config.jwt.refreshCookieName);
      return sendError(res, 'Invalid or expired refresh token', 401);
    }

    const storedToken = await RefreshToken.findOne({ where: { token } });
    if (!storedToken) {
      res.clearCookie(config.jwt.refreshCookieName);
      return sendError(res, 'Refresh token not found', 401);
    }

    if (new Date() > storedToken.expiresAt) {
      await storedToken.destroy();
      res.clearCookie(config.jwt.refreshCookieName);
      return sendError(res, 'Refresh token expired', 401);
    }

    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['passwordHash'] },
    });
    if (!user || !user.isActive) {
      return sendError(res, 'User not found or inactive', 401);
    }

    // Rotate refresh token
    await storedToken.destroy();
    const newRefreshToken = generateRefreshToken(user.id);
    await RefreshToken.create({
      userId: user.id,
      token: newRefreshToken,
      expiresAt: getRefreshTokenExpiry(),
    });

    const accessToken = generateAccessToken(user.id, user.role);
    res.cookie(config.jwt.refreshCookieName, newRefreshToken, cookieOptions);

    return sendSuccess(res, { accessToken, user }, 'Token refreshed');
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.cookies[config.jwt.refreshCookieName];
    if (token) {
      await RefreshToken.destroy({ where: { token } });
    }
    res.clearCookie(config.jwt.refreshCookieName);
    return sendSuccess(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['passwordHash'] },
    });
    return sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);
    const match = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!match) {
      return sendError(res, 'Current password is incorrect', 400);
    }

    const newHash = await bcrypt.hash(newPassword, config.bcrypt.rounds);
    await user.update({ passwordHash: newHash });

    // Invalidate all refresh tokens
    await RefreshToken.destroy({ where: { userId: user.id } });
    res.clearCookie(config.jwt.refreshCookieName);

    return sendSuccess(res, null, 'Password changed successfully. Please log in again.');
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (user) {
      await issuePasswordReset(user);
    }

    // Always return success to prevent email enumeration
    return sendSuccess(
      res,
      null,
      'If an account with that email exists, a reset code has been sent.'
    );
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;
    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (!user || !user.passwordResetOtpHash || !user.passwordResetOtpExpiresAt) {
      return sendError(res, 'Invalid or expired reset code', 400, 'INVALID_OTP');
    }

    if (new Date() > new Date(user.passwordResetOtpExpiresAt)) {
      await user.update({
        passwordResetOtpHash: null,
        passwordResetOtpExpiresAt: null,
        passwordResetAttempts: 0,
      });
      return sendError(res, 'This reset code has expired. Please request a new one.', 400, 'OTP_EXPIRED');
    }

    if (user.passwordResetAttempts >= config.email.maxAttempts) {
      return sendError(res, 'Too many incorrect attempts. Please request a new code.', 429, 'TOO_MANY_ATTEMPTS');
    }

    if (!verifyOtpHash(otp, user.passwordResetOtpHash)) {
      const attempts = user.passwordResetAttempts + 1;
      await user.update({ passwordResetAttempts: attempts });

      const remaining = Math.max(0, config.email.maxAttempts - attempts);
      return sendError(
        res,
        remaining > 0
          ? `Incorrect reset code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
          : 'Too many incorrect attempts. Please request a new code.',
        400,
        'INVALID_OTP'
      );
    }

    const newHash = await bcrypt.hash(password, config.bcrypt.rounds);

    await user.update({
      passwordHash: newHash,
      // Completing the emailed reset proves ownership of the address.
      isEmailVerified: true,
      emailVerificationOtpHash: null,
      emailVerificationOtpExpiresAt: null,
      emailVerificationAttempts: 0,
      emailVerificationLastSentAt: null,
      passwordResetOtpHash: null,
      passwordResetOtpExpiresAt: null,
      passwordResetAttempts: 0,
      passwordResetLastSentAt: null,
    });

    // Invalidate existing sessions after a password reset
    await RefreshToken.destroy({ where: { userId: user.id } });
    res.clearCookie(config.jwt.refreshCookieName);

    return sendSuccess(res, null, 'Password reset successfully. Please sign in with your new password.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
  changePassword,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
};
