'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Appointments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      patientId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Patients', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      doctorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Doctors', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      departmentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Departments', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      appointmentDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      timeSlot: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      cancellationReason: {
        type: Sequelize.TEXT,
        allowNull: true,
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

    await queryInterface.addIndex('Appointments', ['patientId']);
    await queryInterface.addIndex('Appointments', ['doctorId']);
    await queryInterface.addIndex('Appointments', ['appointmentDate']);
    await queryInterface.addIndex('Appointments', ['status']);
    await queryInterface.addIndex('Appointments', ['doctorId', 'appointmentDate', 'timeSlot'], {
      unique: true,
      name: 'unique_doctor_date_slot',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Appointments');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Appointments_status";');
  },
};
