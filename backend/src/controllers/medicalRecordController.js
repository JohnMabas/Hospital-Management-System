'use strict';

const { MedicalRecord, Patient, Doctor, Appointment, User } = require('../models');
const { sendSuccess, sendError, parsePagination, buildPaginationMeta } = require('../utils/response');

const recordIncludes = [
  {
    model: Doctor,
    as: 'doctor',
    include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }],
  },
  {
    model: Patient,
    as: 'patient',
    include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }],
  },
  { model: Appointment, as: 'appointment', attributes: ['id', 'appointmentDate', 'timeSlot', 'reason'] },
];

const createMedicalRecord = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
    if (!doctor) return sendError(res, 'Doctor profile not found', 404);

    const { patientId, appointmentId, diagnosis, prescription, labResults, notes, followUpDate } = req.body;

    // Verify appointment belongs to this doctor if provided
    if (appointmentId) {
      const appt = await Appointment.findOne({ where: { id: appointmentId, doctorId: doctor.id } });
      if (!appt) return sendError(res, 'Appointment not found or not yours', 404);
      if (appt.status !== 'completed') {
        return sendError(res, 'Can only create records for completed appointments', 400);
      }
    }

    const record = await MedicalRecord.create({
      patientId,
      doctorId: doctor.id,
      appointmentId,
      diagnosis,
      prescription,
      labResults: labResults || [],
      notes,
      followUpDate,
    });

    const full = await MedicalRecord.findByPk(record.id, { include: recordIncludes });
    return sendSuccess(res, full, 'Medical record created', 201);
  } catch (error) {
    next(error);
  }
};

const getMyMedicalRecords = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ where: { userId: req.user.id } });
    if (!patient) return sendError(res, 'Patient profile not found', 404);

    const { page, limit, offset } = parsePagination(req.query);

    const { count, rows } = await MedicalRecord.findAndCountAll({
      where: { patientId: patient.id },
      include: recordIncludes,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return sendSuccess(res, rows, 'Medical records fetched', 200, buildPaginationMeta(count, page, limit));
  } catch (error) {
    next(error);
  }
};

const getPatientRecordsForDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
    if (!doctor) return sendError(res, 'Doctor profile not found', 404);

    const { patientId } = req.params;
    const { page, limit, offset } = parsePagination(req.query);

    const { count, rows } = await MedicalRecord.findAndCountAll({
      where: { patientId, doctorId: doctor.id },
      include: recordIncludes,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return sendSuccess(res, rows, 'Patient records fetched', 200, buildPaginationMeta(count, page, limit));
  } catch (error) {
    next(error);
  }
};

module.exports = { createMedicalRecord, getMyMedicalRecords, getPatientRecordsForDoctor };
