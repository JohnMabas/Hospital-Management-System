'use strict';

const { sendError } = require('../utils/response');

/**
 * Centralized error handling middleware
 * Must have 4 parameters for Express to recognize it as an error handler
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error('[Error]', err.name, err.message);

  // Sequelize unique constraint violation
  if (err.name === 'SequelizeUniqueConstraintError') {
    const fields = err.fields || {};
    const fieldName = Object.keys(fields)[0] || 'field';
    return sendError(res, `A record with this ${fieldName} already exists`, 409, 'DUPLICATE_ENTRY');
  }

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map((e) => ({ field: e.path, message: e.message }));
    return sendError(res, 'Database validation failed', 422, 'VALIDATION_ERROR', messages);
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return sendError(res, 'Referenced record does not exist', 400, 'FOREIGN_KEY_ERROR');
  }

  // JWT errors (shouldn't reach here if auth middleware handles them, but just in case)
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token expired', 401, 'TOKEN_EXPIRED');
  }

  // Custom operational errors with a statusCode
  if (err.statusCode && err.statusCode < 500) {
    return sendError(res, err.message, err.statusCode, err.code);
  }

  // Default 500 error - don't leak internal details in production
  const isDev = process.env.NODE_ENV === 'development';
  return sendError(
    res,
    isDev ? err.message : 'An internal server error occurred',
    500,
    'INTERNAL_ERROR',
    isDev ? { stack: err.stack } : undefined
  );
};

module.exports = { errorHandler };
