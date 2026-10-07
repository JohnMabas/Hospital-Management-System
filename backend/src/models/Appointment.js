'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate(models) {
      Appointment.belongsTo(models.Patient, { foreignKey: 'patientId', as: 'patient' });
      Appointment.belongsTo(models.Doctor, { foreignKey: 'doctorId', as: 'doctor' });
      Appointment.belongsTo(models.Department, { foreignKey: 'departmentId', as: 'department' });
      Appointment.hasOne(models.MedicalRecord, { foreignKey: 'appointmentId', as: 'medicalRecord' });
    }
  }

  Appointment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      patientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Patients', key: 'id' },
      },
      doctorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Doctors', key: 'id' },
      },
      departmentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Departments', key: 'id' },
      },
      appointmentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      timeSlot: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'Format: HH:MM (24hr)',
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Doctor notes',
      },
      cancellationReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Appointment',
      tableName: 'Appointments',
      indexes: [
        { fields: ['patientId'] },
        { fields: ['doctorId'] },
        { fields: ['appointmentDate'] },
        { fields: ['status'] },
        {
          unique: true,
          fields: ['doctorId', 'appointmentDate', 'timeSlot'],
          name: 'unique_doctor_date_slot',
        },
      ],
    }
  );

  return Appointment;
};
