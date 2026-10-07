'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ContactMessage extends Model {
    static associate(models) {}
  }

  ContactMessage.init(
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
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: { isEmail: true },
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      subject: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'ContactMessage',
      tableName: 'ContactMessages',
    }
  );

  return ContactMessage;
};
