'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Testimonial extends Model {
    static associate(models) {}
  }

  Testimonial.init(
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
      },
      role: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'e.g. "Patient, Jos North" or "Mother of 2"',
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5,
        validate: { min: 1, max: 5 },
      },
      avatarUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      isVisible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'Testimonial',
      tableName: 'Testimonials',
    }
  );

  return Testimonial;
};
