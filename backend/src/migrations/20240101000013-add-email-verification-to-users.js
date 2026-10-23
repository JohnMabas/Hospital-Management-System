'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Existing accounts are treated as verified; new registrations opt in to verification.
    await queryInterface.addColumn('Users', 'isEmailVerified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });

    await queryInterface.addColumn('Users', 'emailVerificationOtpHash', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'emailVerificationOtpExpiresAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'emailVerificationAttempts', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('Users', 'emailVerificationLastSentAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'passwordResetOtpHash', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'passwordResetOtpExpiresAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'passwordResetAttempts', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('Users', 'passwordResetLastSentAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'passwordResetLastSentAt');
    await queryInterface.removeColumn('Users', 'passwordResetAttempts');
    await queryInterface.removeColumn('Users', 'passwordResetOtpExpiresAt');
    await queryInterface.removeColumn('Users', 'passwordResetOtpHash');
    await queryInterface.removeColumn('Users', 'emailVerificationLastSentAt');
    await queryInterface.removeColumn('Users', 'emailVerificationAttempts');
    await queryInterface.removeColumn('Users', 'emailVerificationOtpExpiresAt');
    await queryInterface.removeColumn('Users', 'emailVerificationOtpHash');
    await queryInterface.removeColumn('Users', 'isEmailVerified');
  },
};
