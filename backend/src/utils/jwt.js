'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config');

const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiresIn }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwt.refreshSecret);
};

const getRefreshTokenExpiry = () => {
  const days = 7;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiry,
};
