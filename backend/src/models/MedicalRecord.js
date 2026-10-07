'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MedicalRecord extends Model {
    static associate(models) {
      MedicalRecord.belongsTo(models.Patient, { foreignKey: 'patientId', as: 'patient' });
      MedicalRecord.belongsTo(models.Doctor, { foreignKey: 'doctorId', as: 'doctor' });
      MedicalRecord.belongsTo(models.Appointment, { foreignKey: 'appointmentId', as: 'appointment' });
    }
  }

  MedicalRecord.init(
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
      appointmentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'Appointments', key: 'id' },
      },
      diagnosis: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      prescription: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      labResults: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
        comment: 'Array of lab result objects',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      followUpDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'MedicalRecord',
      tableName: 'MedicalRecords',
      indexes: [
        { fields: ['patientId'] },
        { fields: ['doctorId'] },
        { fields: ['appointmentId'] },
      ],
    }
  );

  return MedicalRecord;
};
