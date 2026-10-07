'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Testimonials', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: { type: Sequelize.STRING(200), allowNull: false },
      role: { type: Sequelize.STRING(200), allowNull: true },
      message: { type: Sequelize.TEXT, allowNull: false },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5,
      },
      avatarUrl: { type: Sequelize.STRING(500), allowNull: true },
      isVisible: { type: Sequelize.BOOLEAN, defaultValue: true },
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
    await queryInterface.dropTable('Testimonials');
  },
};
