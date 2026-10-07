'use strict';

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { User, Patient, RefreshToken } = require('../models');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, getRefreshTokenExpiry } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');
const config = require('../config');
const { sequelize } = require('../models');

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const register = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    const existing = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existing) {
      await t.rollback();
      return sendError(res, 'Email address is already registered', 409);
    }

    const passwordHash = await bcrypt.hash(password, config.bcrypt.rounds);

    const user = await User.create(
      {
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone,
        passwordHash,
        role: 'patient',
      },
      { transaction: t }
    );

    // Auto-create patient profile
    await Patient.create({ userId: user.id }, { transaction: t });

    await t.commit();

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    await RefreshToken.create({
      userId: user.id,
      token: refreshToken,
      expiresAt: getRefreshTokenExpiry(),
    });

    res.cookie(config.jwt.refreshCookieName, refreshToken, cookieOptions);

    return sendSuccess(
      res,
      {
        user: user.toJSON(),
        accessToken,
      },
      'Registration successful',
      201
    );
  } catch (error) {
    await t.rollback();
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

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    await RefreshToken.create({
      userId: user.id,
      token: refreshToken,
      expiresAt: getRefreshTokenExpiry(),
    });

    res.cookie(config.jwt.refreshCookieName, refreshToken, cookieOptions);

    return sendSuccess(res, {
      user: user.toJSON(),
      accessToken,
    }, 'Login successful');
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

    // Always return success to prevent email enumeration
    if (!user) {
      return sendSuccess(res, null, 'If this email is registered, a reset link has been sent.');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const resetLink = `${config.cors.clientUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    // In dev, log the link. In production, send email.
    console.log('\n=== PASSWORD RESET LINK (DEV ONLY) ===');
    console.log(resetLink);
    console.log('=======================================\n');

    // Store hashed token (simplified - in production use a dedicated table)
    // For now just log it
    return sendSuccess(res, null, 'If this email is registered, a reset link has been sent.');
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, refresh, logout, getMe, changePassword, forgotPassword };
