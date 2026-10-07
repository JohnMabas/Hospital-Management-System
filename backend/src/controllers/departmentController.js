'use strict';

const { Department, Doctor, User, Service } = require('../models');
const { sendSuccess, sendError, parsePagination, buildPaginationMeta } = require('../utils/response');

const getAllDepartments = async (req, res, next) => {
  try {
    const departments = await Department.findAll({
      where: { isActive: true },
      include: [
        {
          model: Doctor,
          as: 'doctors',
          where: { isAvailable: true },
          required: false,
          attributes: ['id'],
        },
      ],
      order: [['name', 'ASC']],
    });

    const result = departments.map((d) => ({
      ...d.toJSON(),
      doctorCount: d.doctors ? d.doctors.length : 0,
    }));

    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

const getDepartmentById = async (req, res, next) => {
  try {
    const dept = await Department.findByPk(req.params.id, {
      include: [
        {
          model: Doctor,
          as: 'doctors',
          include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'email'] }],
        },
        { model: Service, as: 'services', where: { isActive: true }, required: false },
      ],
    });

    if (!dept) return sendError(res, 'Department not found', 404);
    return sendSuccess(res, dept);
  } catch (error) {
    next(error);
  }
};

const createDepartment = async (req, res, next) => {
  try {
    const dept = await Department.create(req.body);
    return sendSuccess(res, dept, 'Department created', 201);
  } catch (error) {
    next(error);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findByPk(req.params.id);
    if (!dept) return sendError(res, 'Department not found', 404);
    await dept.update(req.body);
    return sendSuccess(res, dept, 'Department updated');
  } catch (error) {
    next(error);
  }
};

const deleteDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findByPk(req.params.id);
    if (!dept) return sendError(res, 'Department not found', 404);
    await dept.update({ isActive: false });
    return sendSuccess(res, null, 'Department deactivated');
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment };
