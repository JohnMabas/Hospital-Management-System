'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ContactMessages', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: { type: Sequelize.STRING(200), allowNull: false },
      email: { type: Sequelize.STRING(255), allowNull: false },
      phone: { type: Sequelize.STRING(20), allowNull: true },
      subject: { type: Sequelize.STRING(300), allowNull: false },
      message: { type: Sequelize.TEXT, allowNull: false },
      isRead: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ContactMessages');
  },
};
