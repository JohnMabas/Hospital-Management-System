'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MedicalRecords', {
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
      appointmentId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'Appointments', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      diagnosis: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      prescription: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      labResults: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      followUpDate: {
        type: Sequelize.DATEONLY,
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

    await queryInterface.addIndex('MedicalRecords', ['patientId']);
    await queryInterface.addIndex('MedicalRecords', ['doctorId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('MedicalRecords');
  },
};
