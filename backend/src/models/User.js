'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Doctor, { foreignKey: 'userId', as: 'doctorProfile' });
      User.hasOne(models.Patient, { foreignKey: 'userId', as: 'patientProfile' });
      User.hasMany(models.RefreshToken, { foreignKey: 'userId', as: 'refreshTokens', onDelete: 'CASCADE' });
      User.hasMany(models.BlogPost, { foreignKey: 'authorId', as: 'blogPosts' });
    }

    toJSON() {
      const values = { ...this.get() };
      delete values.passwordHash;
      return values;
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 100],
        },
      },
      lastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 100],
        },
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          is: /^(\+234|0)[789][01]\d{8}$/,
        },
      },
      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('patient', 'doctor', 'admin', 'receptionist'),
        allowNull: false,
        defaultValue: 'patient',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      indexes: [
        { unique: true, fields: ['email'] },
        { fields: ['role'] },
      ],
    }
  );

  return User;
};
