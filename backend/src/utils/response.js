'use strict';

/**
 * Send a consistent success response
 */
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200, meta = null) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send a consistent error response
 */
const sendError = (res, message = 'An error occurred', statusCode = 400, code = null, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (code) {
    response.code = code;
  }

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Build pagination meta from Sequelize count result
 */
const buildPaginationMeta = (count, page, limit) => {
  const totalPages = Math.ceil(count / limit);
  return {
    total: count,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

/**
 * Parse pagination query params with defaults
 */
const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

module.exports = { sendSuccess, sendError, buildPaginationMeta, parsePagination };
