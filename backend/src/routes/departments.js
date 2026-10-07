'use strict';

const express = require('express');
const router = express.Router();

const { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment } = require('../controllers/departmentController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', getAllDepartments);
router.get('/:id', getDepartmentById);
router.post('/', authenticate, authorize('admin'), createDepartment);
router.put('/:id', authenticate, authorize('admin'), updateDepartment);
router.delete('/:id', authenticate, authorize('admin'), deleteDepartment);

module.exports = router;
