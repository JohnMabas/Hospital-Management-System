'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    static associate(models) {
      Department.hasMany(models.Doctor, { foreignKey: 'departmentId', as: 'doctors' });
      Department.hasMany(models.Service, { foreignKey: 'departmentId', as: 'services' });
      Department.hasMany(models.Appointment, { foreignKey: 'departmentId', as: 'appointments' });
    }
  }

  Department.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: { notEmpty: true },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      icon: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Lucide icon name or emoji',
      },
      imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'Department',
      tableName: 'Departments',
    }
  );

  return Department;
};
