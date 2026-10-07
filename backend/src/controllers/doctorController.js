'use strict';

const { Op } = require('sequelize');
const { Doctor, User, Department, DoctorSchedule, Appointment } = require('../models');
const { sendSuccess, sendError, parsePagination, buildPaginationMeta } = require('../utils/response');
const { generateSlots, getDayName } = require('../utils/availability');

const doctorPublicAttributes = {
  include: [
    {
      model: User,
      as: 'user',
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
    },
    {
      model: Department,
      as: 'department',
      attributes: ['id', 'name', 'icon'],
    },
  ],
};

const getAllDoctors = async (req, res, next) => {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const { departmentId, search, available } = req.query;

    const where = {};
    if (available !== undefined) where.isAvailable = available === 'true';

    const userWhere = {};
    if (search) {
      userWhere[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const deptWhere = {};
    if (departmentId) deptWhere.id = departmentId;

    const { count, rows } = await Doctor.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          where: Object.keys(userWhere).length ? userWhere : undefined,
          required: !!search,
        },
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'icon'],
          where: Object.keys(deptWhere).length ? deptWhere : undefined,
          required: !!departmentId,
        },
      ],
      limit,
      offset,
      distinct: true,
    });

    return sendSuccess(res, rows, 'Doctors fetched', 200, buildPaginationMeta(count, page, limit));
  } catch (error) {
    next(error);
  }
};

const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] },
        { model: Department, as: 'department' },
        { model: DoctorSchedule, as: 'schedules', where: { isActive: true }, required: false },
      ],
    });

    if (!doctor) return sendError(res, 'Doctor not found', 404);
    return sendSuccess(res, doctor);
  } catch (error) {
    next(error);
  }
};

const getDoctorAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return sendError(res, 'Valid date (YYYY-MM-DD) is required', 400);
    }

    const doctor = await Doctor.findByPk(id, {
      include: [
        {
          model: DoctorSchedule,
          as: 'schedules',
          where: { isActive: true },
          required: false,
        },
      ],
    });

    if (!doctor) return sendError(res, 'Doctor not found', 404);

    const dayName = getDayName(date);
    const schedule = doctor.schedules.find((s) => s.dayOfWeek === dayName);

    if (!schedule) {
      return sendSuccess(res, { date, available: false, slots: [], message: 'Doctor does not work on this day' });
    }

    // Get all possible slots
    const allSlots = generateSlots(schedule.startTime, schedule.endTime, schedule.slotDurationMinutes);

    // Get booked slots
    const booked = await Appointment.findAll({
      where: {
        doctorId: id,
        appointmentDate: date,
        status: { [Op.in]: ['pending', 'confirmed'] },
      },
      attributes: ['timeSlot'],
    });

    const bookedSlots = new Set(booked.map((a) => a.timeSlot));

    const slots = allSlots.map((time) => ({
      time,
      available: !bookedSlots.has(time),
    }));

    return sendSuccess(res, { date, dayOfWeek: dayName, slots });
  } catch (error) {
    next(error);
  }
};

const createDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.create(req.body);
    const full = await Doctor.findByPk(doctor.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Department, as: 'department' },
      ],
    });
    return sendSuccess(res, full, 'Doctor profile created', 201);
  } catch (error) {
    next(error);
  }
};

const updateDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return sendError(res, 'Doctor not found', 404);
    await doctor.update(req.body);
    return sendSuccess(res, doctor, 'Doctor updated');
  } catch (error) {
    next(error);
  }
};

const getMyDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({
      where: { userId: req.user.id },
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] },
        { model: Department, as: 'department' },
        { model: DoctorSchedule, as: 'schedules', where: { isActive: true }, required: false },
      ],
    });

    if (!doctor) return sendError(res, 'Doctor profile not found', 404);
    return sendSuccess(res, doctor);
  } catch (error) {
    next(error);
  }
};

const manageDoctorSchedule = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
    if (!doctor) return sendError(res, 'Doctor profile not found', 404);

    const { schedules } = req.body; // Array of schedule objects

    // Delete all existing schedules and replace
    await DoctorSchedule.destroy({ where: { doctorId: doctor.id } });

    const newSchedules = await DoctorSchedule.bulkCreate(
      schedules.map((s) => ({ ...s, doctorId: doctor.id }))
    );

    return sendSuccess(res, newSchedules, 'Schedule updated');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  getDoctorAvailability,
  createDoctor,
  updateDoctor,
  getMyDoctorProfile,
  manageDoctorSchedule,
};
