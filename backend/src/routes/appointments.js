'use strict';

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
  getAdminAppointments,
} = require('../controllers/appointmentController');
const { authenticate, authorize } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');

// Patient routes
router.post(
  '/',
  authenticate,
  authorize('patient'),
  [
    body('doctorId').isUUID().withMessage('Valid doctor ID required'),
    body('departmentId').isUUID().withMessage('Valid department ID required'),
    body('appointmentDate').isDate().withMessage('Valid date (YYYY-MM-DD) required'),
    body('timeSlot').matches(/^\d{2}:\d{2}$/).withMessage('Valid time slot (HH:MM) required'),
    body('reason').isLength({ min: 5, max: 500 }).withMessage('Reason must be 5-500 characters'),
  ],
  validate,
  bookAppointment
);

router.get('/my', authenticate, authorize('patient'), getMyAppointments);
router.patch('/:id/cancel', authenticate, authorize('patient'), cancelAppointment);

// Doctor routes
router.get('/doctor', authenticate, authorize('doctor'), getDoctorAppointments);
router.patch(
  '/:id/status',
  authenticate,
  authorize('doctor'),
  [body('status').isIn(['confirmed', 'completed', 'cancelled']).withMessage('Invalid status')],
  validate,
  updateAppointmentStatus
);

// Admin routes
router.get('/admin', authenticate, authorize('admin'), getAdminAppointments);

module.exports = router;
