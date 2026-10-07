'use strict';

const express = require('express');
const router = express.Router();

const {
  getAllDoctors,
  getDoctorById,
  getDoctorAvailability,
  createDoctor,
  updateDoctor,
  getMyDoctorProfile,
  manageDoctorSchedule,
} = require('../controllers/doctorController');
const { authenticate, authorize } = require('../middlewares/auth');

// ── Public ────────────────────────────────────────────────────────────────────
router.get('/', getAllDoctors);

// !! IMPORTANT: /me/* routes MUST be declared BEFORE /:id, otherwise
// Express will match "me" as the :id parameter and call getDoctorById.
// ── Doctor-auth only ─────────────────────────────────────────────────────────
router.get('/me/profile',   authenticate, authorize('doctor'), getMyDoctorProfile);
router.put('/me/schedule',  authenticate, authorize('doctor'), manageDoctorSchedule);

// ── Public (parameterised — must come after fixed-segment routes) ─────────────
router.get('/:id',              getDoctorById);
router.get('/:id/availability', getDoctorAvailability);

// ── Admin only ────────────────────────────────────────────────────────────────
router.post('/',   authenticate, authorize('admin'),          createDoctor);
router.put('/:id', authenticate, authorize('admin', 'doctor'), updateDoctor);

module.exports = router;
