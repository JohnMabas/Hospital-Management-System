'use strict';

const express = require('express');
const router = express.Router();

const { getAllServices, createService, updateService, deleteService } = require('../controllers/serviceController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', getAllServices);
router.post('/', authenticate, authorize('admin'), createService);
router.put('/:id', authenticate, authorize('admin'), updateService);
router.delete('/:id', authenticate, authorize('admin'), deleteService);

module.exports = router;
