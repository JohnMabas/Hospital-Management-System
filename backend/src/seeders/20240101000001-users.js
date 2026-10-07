'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const adminId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
const doctorUserIds = [
  'b1b2c3d4-e5f6-7890-abcd-ef1234567891',
  'b2b2c3d4-e5f6-7890-abcd-ef1234567892',
  'b3b2c3d4-e5f6-7890-abcd-ef1234567893',
  'b4b2c3d4-e5f6-7890-abcd-ef1234567894',
  'b5b2c3d4-e5f6-7890-abcd-ef1234567895',
  'b6b2c3d4-e5f6-7890-abcd-ef1234567896',
  'b7b2c3d4-e5f6-7890-abcd-ef1234567897',
  'b8b2c3d4-e5f6-7890-abcd-ef1234567898',
];
const patientUserIds = [
  'c1b2c3d4-e5f6-7890-abcd-ef1234567899',
  'c2b2c3d4-e5f6-7890-abcd-ef1234567900',
  'c3b2c3d4-e5f6-7890-abcd-ef1234567901',
];

module.exports = {
  async up(queryInterface) {
    const hash = await bcrypt.hash('Password123!', 12);
    const patientHash = await bcrypt.hash('Patient123!', 12);

    const now = new Date();

    await queryInterface.bulkInsert('Users', [
      // Admin
      {
        id: adminId,
        firstName: 'Super',
        lastName: 'Admin',
        email: 'admin@carebridge.com',
        phone: '+2348012345678',
        passwordHash: hash,
        role: 'admin',
        isActive: true,
        lastLoginAt: null,
        createdAt: now,
        updatedAt: now,
      },
      // Doctors
      {
        id: doctorUserIds[0],
        firstName: 'Chukwuemeka',
        lastName: 'Okonkwo',
        email: 'dr.okonkwo@carebridge.com',
        phone: '+2348023456789',
        passwordHash: hash,
        role: 'doctor',
        isActive: true,
        lastLoginAt: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: doctorUserIds[1],
        firstName: 'Adaeze',
        lastName: 'Nwachukwu',
        email: 'dr.nwachukwu@carebridge.com',
        phone: '+2348034567890',
        passwordHash: hash,
        role: 'doctor',
        isActive: true,
        lastLoginAt: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: doctorUserIds[2],
        firstName: 'Babatunde',
        lastName: 'Adeyemi',
        email: 'dr.adeyemi@carebridge.com',
        phone: '+2348045678901',
        passwordHash: hash,
        role: 'doctor',
        isActive: true,
        lastLoginAt: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: doctorUserIds[3],
        firstName: 'Ngozi',
        lastName: 'Eze',
        email: 'dr.eze@carebridge.com',
        phone: '+2348056789012',
        passwordHash: hash,
        role: 'doctor',
        isActive: true,
        lastLoginAt: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: doctorUserIds[4],
        firstName: 'Emeka',
        lastName: 'Ikechukwu',
        email: 'dr.ikechukwu@carebridge.com',
        phone: '+2348067890123',
        passwordHash: hash,
        role: 'doctor',
        isActive: true,
        lastLoginAt: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: doctorUserIds[5],
        firstName: 'Fatima',
        lastName: 'Abdullahi',
        email: 'dr.abdullahi@carebridge.com',
        phone: '+2348078901234',
        passwordHash: hash,
        role: 'doctor',
        isActive: true,
        lastLoginAt: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: doctorUserIds[6],
        firstName: 'Oluwaseun',
        lastName: 'Fasanya',
        email: 'dr.fasanya@carebridge.com',
        phone: '+2348089012345',
        passwordHash: hash,
        role: 'doctor',
        isActive: true,
        lastLoginAt: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: doctorUserIds[7],
        firstName: 'Amaka',
        lastName: 'Obiora',
        email: 'dr.obiora@carebridge.com',
        phone: '+2348090123456',
        passwordHash: hash,
        role: 'doctor',
        isActive: true,
        lastLoginAt: null,
        createdAt: now,
        updatedAt: now,
      },
      // Patients
      {
        id: patientUserIds[0],
        firstName: 'Tunde',
        lastName: 'Bakare',
        email: 'patient@carebridge.com',
        phone: '+2348011223344',
        passwordHash: patientHash,
        role: 'patient',
        isActive: true,
        lastLoginAt: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: patientUserIds[1],
        firstName: 'Chioma',
        lastName: 'Okafor',
        email: 'chioma@test.com',
        phone: '+2348022334455',
        passwordHash: patientHash,
        role: 'patient',
        isActive: true,
        lastLoginAt: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: patientUserIds[2],
        firstName: 'Musa',
        lastName: 'Ibrahim',
        email: 'musa@test.com',
        phone: '+2348033445566',
        passwordHash: patientHash,
        role: 'patient',
        isActive: true,
        lastLoginAt: null,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};

module.exports.adminId = adminId;
module.exports.doctorUserIds = doctorUserIds;
module.exports.patientUserIds = patientUserIds;
