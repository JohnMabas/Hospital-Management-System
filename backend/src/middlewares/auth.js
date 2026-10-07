'use strict';

const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config');
const { sendError } = require('../utils/response');

/**
 * Verify JWT access token and attach user to request
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Access token required', 401);
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.accessSecret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return sendError(res, 'Access token expired', 401, 'TOKEN_EXPIRED');
      }
      return sendError(res, 'Invalid access token', 401);
    }

    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['passwordHash'] },
    });

    if (!user) {
      return sendError(res, 'User not found', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'Account is deactivated', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Role-based authorization middleware
 * Usage: authorize('admin', 'doctor')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. Requires one of: ${roles.join(', ')}`,
        403
      );
    }

    next();
  };
};

/**
 * Optional auth - attaches user if token present but doesn't fail if not
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, config.jwt.accessSecret);
      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ['passwordHash'] },
      });
      if (user && user.isActive) {
        req.user = user;
      }
    } catch (err) {
      // Silent failure for optional auth
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authenticate, authorize, optionalAuth };
