'use strict';

const express = require('express');
const router = express.Router();

const { createMedicalRecord, getMyMedicalRecords, getPatientRecordsForDoctor } = require('../controllers/medicalRecordController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/my', authenticate, authorize('patient'), getMyMedicalRecords);
router.post('/', authenticate, authorize('doctor'), createMedicalRecord);
router.get('/patient/:patientId', authenticate, authorize('doctor', 'admin'), getPatientRecordsForDoctor);

module.exports = router;
