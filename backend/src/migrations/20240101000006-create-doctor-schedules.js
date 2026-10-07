'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DoctorSchedules', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      doctorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Doctors', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      dayOfWeek: {
        type: Sequelize.ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
        allowNull: false,
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      slotDurationMinutes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 30,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
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

    await queryInterface.addIndex('DoctorSchedules', ['doctorId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DoctorSchedules');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_DoctorSchedules_dayOfWeek";');
  },
};
