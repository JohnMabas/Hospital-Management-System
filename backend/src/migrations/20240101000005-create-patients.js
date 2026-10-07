'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Patients', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other'),
        allowNull: true,
      },
      bloodGroup: {
        type: Sequelize.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
        allowNull: true,
      },
      genotype: {
        type: Sequelize.ENUM('AA', 'AS', 'SS', 'AC', 'SC'),
        allowNull: true,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      lga: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      emergencyContactName: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      emergencyContactPhone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      nhisNumber: {
        type: Sequelize.STRING(50),
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

    await queryInterface.addIndex('Patients', ['userId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Patients');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Patients_gender";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Patients_bloodGroup";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Patients_genotype";');
  },
};
