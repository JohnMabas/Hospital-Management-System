'use strict';

const { Op } = require('sequelize');
const { Appointment, Patient, Doctor, Department, User, DoctorSchedule } = require('../models');
const { sendSuccess, sendError, parsePagination, buildPaginationMeta } = require('../utils/response');
const { generateSlots, getDayName } = require('../utils/availability');
const { sequelize } = require('../models');

const appointmentIncludes = [
  {
    model: Patient,
    as: 'patient',
    include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'email', 'phone'] }],
  },
  {
    model: Doctor,
    as: 'doctor',
    include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }],
  },
  {
    model: Department,
    as: 'department',
    attributes: ['id', 'name', 'icon'],
  },
];

const bookAppointment = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { doctorId, departmentId, appointmentDate, timeSlot, reason } = req.body;

    // Get patient profile
    const patient = await Patient.findOne({ where: { userId: req.user.id } });
    if (!patient) {
      await t.rollback();
      return sendError(res, 'Patient profile not found', 404);
    }

    // Verify doctor exists and is available
    const doctor = await Doctor.findByPk(doctorId, {
      include: [{ model: DoctorSchedule, as: 'schedules', where: { isActive: true }, required: false }],
    });
    if (!doctor || !doctor.isAvailable) {
      await t.rollback();
      return sendError(res, 'Doctor not available', 404);
    }

    // Check slot is in doctor's schedule
    const dayName = getDayName(appointmentDate);
    const schedule = doctor.schedules.find((s) => s.dayOfWeek === dayName);
    if (!schedule) {
      await t.rollback();
      return sendError(res, 'Doctor does not have a schedule on this day', 400);
    }

    const validSlots = generateSlots(schedule.startTime, schedule.endTime, schedule.slotDurationMinutes);
    if (!validSlots.includes(timeSlot)) {
      await t.rollback();
      return sendError(res, 'Invalid time slot', 400);
    }

    // Check for double booking (unique constraint will also catch this)
    const existing = await Appointment.findOne({
      where: {
        doctorId,
        appointmentDate,
        timeSlot,
        status: { [Op.in]: ['pending', 'confirmed'] },
      },
    });
    if (existing) {
      await t.rollback();
      return sendError(res, 'This time slot is already booked', 409);
    }

    // Check patient doesn't have conflicting appointment
    const patientConflict = await Appointment.findOne({
      where: {
        patientId: patient.id,
        appointmentDate,
        timeSlot,
        status: { [Op.in]: ['pending', 'confirmed'] },
      },
    });
    if (patientConflict) {
      await t.rollback();
      return sendError(res, 'You already have an appointment at this time', 409);
    }

    const appointment = await Appointment.create(
      {
        patientId: patient.id,
        doctorId,
        departmentId,
        appointmentDate,
        timeSlot,
        reason,
        status: 'pending',
      },
      { transaction: t }
    );

    await t.commit();

    const full = await Appointment.findByPk(appointment.id, { include: appointmentIncludes });
    return sendSuccess(res, full, 'Appointment booked successfully', 201);
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

const getMyAppointments = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ where: { userId: req.user.id } });
    if (!patient) return sendError(res, 'Patient profile not found', 404);

    const { page, limit, offset } = parsePagination(req.query);
    const { status } = req.query;

    const where = { patientId: patient.id };
    if (status) where.status = status;

    const { count, rows } = await Appointment.findAndCountAll({
      where,
      include: appointmentIncludes,
      order: [['appointmentDate', 'DESC'], ['timeSlot', 'DESC']],
      limit,
      offset,
      distinct: true,
    });

    return sendSuccess(res, rows, 'Appointments fetched', 200, buildPaginationMeta(count, page, limit));
  } catch (error) {
    next(error);
  }
};

const cancelAppointment = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ where: { userId: req.user.id } });
    const appointment = await Appointment.findOne({
      where: { id: req.params.id, patientId: patient.id },
    });

    if (!appointment) return sendError(res, 'Appointment not found', 404);
    if (['completed', 'cancelled'].includes(appointment.status)) {
      return sendError(res, `Cannot cancel a ${appointment.status} appointment`, 400);
    }

    await appointment.update({
      status: 'cancelled',
      cancellationReason: req.body.reason || 'Cancelled by patient',
    });

    return sendSuccess(res, appointment, 'Appointment cancelled');
  } catch (error) {
    next(error);
  }
};

const getDoctorAppointments = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
    if (!doctor) return sendError(res, 'Doctor profile not found', 404);

    const { page, limit, offset } = parsePagination(req.query);
    const { status, date } = req.query;

    const where = { doctorId: doctor.id };
    if (status) where.status = status;
    if (date) where.appointmentDate = date;

    const { count, rows } = await Appointment.findAndCountAll({
      where,
      include: appointmentIncludes,
      order: [['appointmentDate', 'ASC'], ['timeSlot', 'ASC']],
      limit,
      offset,
      distinct: true,
    });

    return sendSuccess(res, rows, 'Appointments fetched', 200, buildPaginationMeta(count, page, limit));
  } catch (error) {
    next(error);
  }
};

const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    // Doctors can confirm/complete; patients can cancel (handled in cancelAppointment)
    const allowedStatuses = ['confirmed', 'completed', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return sendError(res, 'Invalid status', 400);
    }

    const appointment = await Appointment.findByPk(req.params.id, { include: appointmentIncludes });
    if (!appointment) return sendError(res, 'Appointment not found', 404);

    // Check doctor owns this appointment
    const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
    if (!doctor || appointment.doctorId !== doctor.id) {
      return sendError(res, 'Not authorized to update this appointment', 403);
    }

    const updates = { status };
    if (notes) updates.notes = notes;

    await appointment.update(updates);
    return sendSuccess(res, appointment, 'Appointment status updated');
  } catch (error) {
    next(error);
  }
};

const getAdminAppointments = async (req, res, next) => {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const { status, date, doctorId, departmentId } = req.query;

    const where = {};
    if (status) where.status = status;
    if (date) where.appointmentDate = date;
    if (doctorId) where.doctorId = doctorId;
    if (departmentId) where.departmentId = departmentId;

    const { count, rows } = await Appointment.findAndCountAll({
      where,
      include: appointmentIncludes,
      order: [['appointmentDate', 'DESC'], ['timeSlot', 'DESC']],
      limit,
      offset,
      distinct: true,
    });

    return sendSuccess(res, rows, 'Appointments fetched', 200, buildPaginationMeta(count, page, limit));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
  getAdminAppointments,
};
