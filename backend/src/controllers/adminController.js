'use strict';

const { Op, fn, col, literal } = require('sequelize');
const { User, Doctor, Patient, Appointment, Department, Service, ContactMessage, BlogPost, Testimonial } = require('../models');
const { sendSuccess, sendError, parsePagination, buildPaginationMeta } = require('../utils/response');
const { sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const config = require('../config');

const getStats = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      appointmentsToday,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
      unreadMessages,
    ] = await Promise.all([
      Patient.count(),
      Doctor.count(),
      Appointment.count(),
      Appointment.count({ where: { appointmentDate: today } }),
      Appointment.count({ where: { status: 'pending' } }),
      Appointment.count({ where: { status: 'confirmed' } }),
      Appointment.count({ where: { status: 'completed' } }),
      Appointment.count({ where: { status: 'cancelled' } }),
      ContactMessage.count({ where: { isRead: false } }),
    ]);

    // Revenue estimate: count completed appointments and sum consultation fees
    const revenueResult = await Appointment.findAll({
      where: { status: 'completed' },
      include: [{ model: Doctor, as: 'doctor', attributes: ['consultationFee'] }],
      attributes: [],
    });
    const estimatedRevenue = revenueResult.reduce((sum, a) => {
      return sum + (parseFloat(a.doctor?.consultationFee) || 0);
    }, 0);

    // Appointments by status for chart
    const appointmentsByStatus = {
      pending: pendingAppointments,
      confirmed: confirmedAppointments,
      completed: completedAppointments,
      cancelled: cancelledAppointments,
    };

    return sendSuccess(res, {
      totalPatients,
      totalDoctors,
      totalAppointments,
      appointmentsToday,
      unreadMessages,
      estimatedRevenue,
      appointmentsByStatus,
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const { role, search } = req.query;

    const where = {};
    if (role) where.role = role;
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['passwordHash'] },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return sendSuccess(res, rows, 'Users fetched', 200, buildPaginationMeta(count, page, limit));
  } catch (error) {
    next(error);
  }
};

const createDoctorUser = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { firstName, lastName, email, phone, password, departmentId, specialization, bio, yearsOfExperience, licenseNumber, consultationFee } = req.body;

    const existing = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existing) {
      await t.rollback();
      return sendError(res, 'Email already registered', 409);
    }

    const passwordHash = await bcrypt.hash(password || 'TempPassword123!', config.bcrypt.rounds);

    const user = await User.create({ firstName, lastName, email: email.toLowerCase(), phone, passwordHash, role: 'doctor' }, { transaction: t });
    const doctor = await Doctor.create({ userId: user.id, departmentId, specialization, bio, yearsOfExperience: yearsOfExperience || 0, licenseNumber, consultationFee: consultationFee || 5000 }, { transaction: t });

    await t.commit();
    return sendSuccess(res, { user: user.toJSON(), doctor }, 'Doctor account created', 201);
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

const toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);
    if (user.role === 'admin') return sendError(res, 'Cannot deactivate admin', 403);
    await user.update({ isActive: !user.isActive });
    return sendSuccess(res, { isActive: user.isActive }, `User ${user.isActive ? 'activated' : 'deactivated'}`);
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getAllUsers, createDoctorUser, toggleUserActive };
