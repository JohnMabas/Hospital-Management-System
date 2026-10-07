'use strict';

const { v4: uuidv4 } = require('uuid');

const doctorIds = [
  'e1b2c3d4-e5f6-7890-abcd-ef1234567811',
  'e2b2c3d4-e5f6-7890-abcd-ef1234567812',
  'e3b2c3d4-e5f6-7890-abcd-ef1234567813',
  'e4b2c3d4-e5f6-7890-abcd-ef1234567814',
  'e5b2c3d4-e5f6-7890-abcd-ef1234567815',
  'e6b2c3d4-e5f6-7890-abcd-ef1234567816',
  'e7b2c3d4-e5f6-7890-abcd-ef1234567817',
  'e8b2c3d4-e5f6-7890-abcd-ef1234567818',
];

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const saturdayDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function buildSchedule(doctorId, workDays, start, end, slot = 30) {
  return workDays.map((day) => ({
    id: uuidv4(),
    doctorId,
    dayOfWeek: day,
    startTime: start,
    endTime: end,
    slotDurationMinutes: slot,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

module.exports = {
  async up(queryInterface) {
    const schedules = [
      ...buildSchedule(doctorIds[0], days, '08:00', '16:00', 30),
      ...buildSchedule(doctorIds[1], saturdayDays, '09:00', '17:00', 30),
      ...buildSchedule(doctorIds[2], days, '08:00', '15:00', 45),
      ...buildSchedule(doctorIds[3], ['monday', 'wednesday', 'friday'], '07:00', '13:00', 60),
      ...buildSchedule(doctorIds[4], days, '10:00', '18:00', 30),
      ...buildSchedule(doctorIds[5], saturdayDays, '08:00', '16:00', 30),
      ...buildSchedule(doctorIds[6], days, '09:00', '17:00', 30),
      ...buildSchedule(doctorIds[7], ['tuesday', 'thursday', 'saturday'], '08:00', '14:00', 30),
    ];

    await queryInterface.bulkInsert('DoctorSchedules', schedules);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('DoctorSchedules', null, {});
  },
};
