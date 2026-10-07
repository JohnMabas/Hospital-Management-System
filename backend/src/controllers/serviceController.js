'use strict';

const { Op } = require('sequelize');
const { Service, Department } = require('../models');
const { sendSuccess, sendError, parsePagination, buildPaginationMeta } = require('../utils/response');

const getAllServices = async (req, res, next) => {
  try {
    const { departmentId, search } = req.query;
    const { page, limit, offset } = parsePagination(req.query);

    const where = { isActive: true };
    if (departmentId) where.departmentId = departmentId;
    if (search) where.name = { [Op.iLike]: `%${search}%` };

    const { count, rows } = await Service.findAndCountAll({
      where,
      include: [{ model: Department, as: 'department', attributes: ['id', 'name', 'icon'] }],
      order: [['name', 'ASC']],
      limit,
      offset,
    });

    return sendSuccess(res, rows, 'Services fetched', 200, buildPaginationMeta(count, page, limit));
  } catch (error) {
    next(error);
  }
};

const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    return sendSuccess(res, service, 'Service created', 201);
  } catch (error) {
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return sendError(res, 'Service not found', 404);
    await service.update(req.body);
    return sendSuccess(res, service, 'Service updated');
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return sendError(res, 'Service not found', 404);
    await service.update({ isActive: false });
    return sendSuccess(res, null, 'Service deactivated');
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllServices, createService, updateService, deleteService };
