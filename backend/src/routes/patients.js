'use strict';

const express = require('express');
const router = express.Router();

const { getPatientProfile, updatePatientProfile } = require('../controllers/patientController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/profile', authenticate, authorize('patient'), getPatientProfile);
router.put('/profile', authenticate, authorize('patient'), updatePatientProfile);

module.exports = router;
