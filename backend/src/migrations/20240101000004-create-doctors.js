'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Doctors', {
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
      departmentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Departments', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      specialization: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      yearsOfExperience: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      licenseNumber: {
        type: Sequelize.STRING(50),
        allowNull: true,
        unique: true,
      },
      consultationFee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 5000.00,
      },
      avatarUrl: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      isAvailable: {
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

    await queryInterface.addIndex('Doctors', ['departmentId']);
    await queryInterface.addIndex('Doctors', ['userId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Doctors');
  },
};
