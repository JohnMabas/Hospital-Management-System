'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      Service.belongsTo(models.Department, { foreignKey: 'departmentId', as: 'department' });
    }
  }

  Service.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: { notEmpty: true },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Price in Nigerian Naira (NGN)',
      },
      departmentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'Departments', key: 'id' },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      icon: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Service',
      tableName: 'Services',
      indexes: [{ fields: ['departmentId'] }],
    }
  );

  return Service;
};
