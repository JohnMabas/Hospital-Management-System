'use strict';

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const {
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
  submitContact, getContactMessages, markMessageRead,
} = require('../controllers/publicController');
const { authenticate, authorize } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');

// Testimonials
router.get('/testimonials', getTestimonials);
router.post('/testimonials', authenticate, authorize('admin'), createTestimonial);
router.put('/testimonials/:id', authenticate, authorize('admin'), updateTestimonial);
router.delete('/testimonials/:id', authenticate, authorize('admin'), deleteTestimonial);

// Contact
router.post(
  '/contact',
  [
    body('name').trim().isLength({ min: 2, max: 200 }).withMessage('Name required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('subject').trim().isLength({ min: 3, max: 300 }).withMessage('Subject required'),
    body('message').trim().isLength({ min: 10, max: 5000 }).withMessage('Message must be 10-5000 characters'),
  ],
  validate,
  submitContact
);

router.get('/contact', authenticate, authorize('admin'), getContactMessages);
router.patch('/contact/:id/read', authenticate, authorize('admin'), markMessageRead);

module.exports = router;
