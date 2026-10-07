'use strict';

const patientUserIds = [
  'c1b2c3d4-e5f6-7890-abcd-ef1234567899',
  'c2b2c3d4-e5f6-7890-abcd-ef1234567900',
  'c3b2c3d4-e5f6-7890-abcd-ef1234567901',
];

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('Patients', [
      {
        id: 'f1b2c3d4-e5f6-7890-abcd-ef1234567821',
        userId: patientUserIds[0],
        dateOfBirth: '1990-05-15',
        gender: 'male',
        bloodGroup: 'O+',
        genotype: 'AS',
        address: '12 Yakubu Gowon Way, Jos North',
        state: 'Plateau',
        lga: 'Jos North',
        emergencyContactName: 'Mrs. Funmilayo Bakare',
        emergencyContactPhone: '+2348011223355',
        nhisNumber: 'NHIS-2019-123456',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'f2b2c3d4-e5f6-7890-abcd-ef1234567822',
        userId: patientUserIds[1],
        dateOfBirth: '1995-08-22',
        gender: 'female',
        bloodGroup: 'A+',
        genotype: 'AA',
        address: '5 Naraguta Avenue, Jos South',
        state: 'Plateau',
        lga: 'Jos South',
        emergencyContactName: 'Mr. Chidi Okafor',
        emergencyContactPhone: '+2348022334466',
        nhisNumber: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'f3b2c3d4-e5f6-7890-abcd-ef1234567823',
        userId: patientUserIds[2],
        dateOfBirth: '1985-03-10',
        gender: 'male',
        bloodGroup: 'B+',
        genotype: 'AA',
        address: '34 Ahmadu Bello Way, Bauchi Road, Jos',
        state: 'Plateau',
        lga: 'Jos North',
        emergencyContactName: 'Hauwa Ibrahim',
        emergencyContactPhone: '+2348033445577',
        nhisNumber: 'NHIS-2020-654321',
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Patients', null, {});
  },
};
