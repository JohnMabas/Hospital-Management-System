'use strict';

const { Patient, User } = require('../models');
const { sendSuccess, sendError } = require('../utils/response');

const getPatientProfile = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({
      where: { userId: req.user.id },
      include: [{ model: User, as: 'user', attributes: { exclude: ['passwordHash'] } }],
    });
    if (!patient) return sendError(res, 'Patient profile not found', 404);
    return sendSuccess(res, patient);
  } catch (error) {
    next(error);
  }
};

const updatePatientProfile = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ where: { userId: req.user.id } });
    if (!patient) return sendError(res, 'Patient profile not found', 404);

    // Update patient profile fields
    const patientFields = ['dateOfBirth', 'gender', 'bloodGroup', 'genotype', 'address', 'state', 'lga', 'emergencyContactName', 'emergencyContactPhone', 'nhisNumber'];
    const patientUpdates = {};
    patientFields.forEach((f) => { if (req.body[f] !== undefined) patientUpdates[f] = req.body[f]; });

    // Update user fields
    const userFields = ['firstName', 'lastName', 'phone'];
    const userUpdates = {};
    userFields.forEach((f) => { if (req.body[f] !== undefined) userUpdates[f] = req.body[f]; });

    if (Object.keys(patientUpdates).length) await patient.update(patientUpdates);
    if (Object.keys(userUpdates).length) await User.update(userUpdates, { where: { id: req.user.id } });

    const updated = await Patient.findOne({
      where: { userId: req.user.id },
      include: [{ model: User, as: 'user', attributes: { exclude: ['passwordHash'] } }],
    });

    return sendSuccess(res, updated, 'Profile updated');
  } catch (error) {
    next(error);
  }
};

module.exports = { getPatientProfile, updatePatientProfile };
