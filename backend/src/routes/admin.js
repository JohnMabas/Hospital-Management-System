'use strict';

const express = require('express');
const router = express.Router();

const { getStats, getAllUsers, createDoctorUser, toggleUserActive } = require('../controllers/adminController');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.post('/doctors', createDoctorUser);
router.patch('/users/:id/toggle-active', toggleUserActive);

module.exports = router;
