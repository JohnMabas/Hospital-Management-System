'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    static associate(models) {
      Doctor.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Doctor.belongsTo(models.Department, { foreignKey: 'departmentId', as: 'department' });
      Doctor.hasMany(models.DoctorSchedule, { foreignKey: 'doctorId', as: 'schedules', onDelete: 'CASCADE' });
      Doctor.hasMany(models.Appointment, { foreignKey: 'doctorId', as: 'appointments' });
      Doctor.hasMany(models.MedicalRecord, { foreignKey: 'doctorId', as: 'medicalRecords' });
    }
  }

  Doctor.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: { model: 'Users', key: 'id' },
      },
      departmentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Departments', key: 'id' },
      },
      specialization: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      yearsOfExperience: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 50 },
      },
      licenseNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
        comment: 'MDCN License Number',
      },
      consultationFee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 5000.00,
        comment: 'Fee in Nigerian Naira (NGN)',
      },
      avatarUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'Doctor',
      tableName: 'Doctors',
      indexes: [
        { fields: ['departmentId'] },
        { fields: ['userId'] },
      ],
    }
  );

  return Doctor;
};
