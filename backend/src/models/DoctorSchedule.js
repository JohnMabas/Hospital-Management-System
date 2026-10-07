'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DoctorSchedule extends Model {
    static associate(models) {
      DoctorSchedule.belongsTo(models.Doctor, { foreignKey: 'doctorId', as: 'doctor' });
    }
  }

  DoctorSchedule.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      doctorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Doctors', key: 'id' },
      },
      dayOfWeek: {
        type: DataTypes.ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
        allowNull: false,
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
        comment: 'Format: HH:MM',
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
        comment: 'Format: HH:MM',
      },
      slotDurationMinutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30,
        validate: { min: 15, max: 120 },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'DoctorSchedule',
      tableName: 'DoctorSchedules',
      indexes: [
        { fields: ['doctorId'] },
        { fields: ['doctorId', 'dayOfWeek'] },
      ],
    }
  );

  return DoctorSchedule;
};
