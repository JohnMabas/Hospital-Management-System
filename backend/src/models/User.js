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
      delete values.emailVerificationOtpHash;
      delete values.emailVerificationOtpExpiresAt;
      delete values.emailVerificationAttempts;
      delete values.emailVerificationLastSentAt;
      delete values.passwordResetOtpHash;
      delete values.passwordResetOtpExpiresAt;
      delete values.passwordResetAttempts;
      delete values.passwordResetLastSentAt;
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
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      emailVerificationOtpHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      emailVerificationOtpExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      emailVerificationAttempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      emailVerificationLastSentAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      passwordResetOtpHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      passwordResetOtpExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      passwordResetAttempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      passwordResetLastSentAt: {
        type: DataTypes.DATE,
        allowNull: true,
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
