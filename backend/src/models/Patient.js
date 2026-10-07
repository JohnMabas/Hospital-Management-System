'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    static associate(models) {
      Patient.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Patient.hasMany(models.Appointment, { foreignKey: 'patientId', as: 'appointments' });
      Patient.hasMany(models.MedicalRecord, { foreignKey: 'patientId', as: 'medicalRecords' });
    }
  }

  Patient.init(
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
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: true,
      },
      bloodGroup: {
        type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
        allowNull: true,
      },
      genotype: {
        type: DataTypes.ENUM('AA', 'AS', 'SS', 'AC', 'SC'),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Nigerian state of residence',
      },
      lga: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Local Government Area',
      },
      emergencyContactName: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      emergencyContactPhone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      nhisNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'NHIS/HMO Number',
      },
    },
    {
      sequelize,
      modelName: 'Patient',
      tableName: 'Patients',
      indexes: [{ fields: ['userId'] }],
    }
  );

  return Patient;
};
