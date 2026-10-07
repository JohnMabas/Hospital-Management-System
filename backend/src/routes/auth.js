'use strict';

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { register, login, refresh, logout, getMe, changePassword, forgotPassword } = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many attempts. Please try again in 15 minutes.' },
});

router.post(
  '/register',
  authLimiter,
  [
    body('firstName').trim().isLength({ min: 2, max: 100 }).withMessage('First name must be 2-100 characters'),
    body('lastName').trim().isLength({ min: 2, max: 100 }).withMessage('Last name must be 2-100 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone')
      .optional()
      .matches(/^(\+234|0)[789][01]\d{8}$/)
      .withMessage('Invalid Nigerian phone number'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
      .withMessage('Password must contain at least one letter and one number'),
  ],
  validate,
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

router.put(
  '/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
      .withMessage('New password must contain at least one letter and one number'),
  ],
  validate,
  changePassword
);

router.post(
  '/forgot-password',
  authLimiter,
  [body('email').isEmail().normalizeEmail().withMessage('Valid email is required')],
  validate,
  forgotPassword
);

module.exports = router;
