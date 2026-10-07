'use strict';

/**
 * Generate all possible time slots for a given schedule
 * @param {string} startTime - "HH:MM"
 * @param {string} endTime - "HH:MM"
 * @param {number} durationMinutes
 * @returns {string[]} - Array of time strings like ["09:00", "09:30", ...]
 */
const generateSlots = (startTime, endTime, durationMinutes) => {
  const slots = [];
  const [startHr, startMin] = startTime.split(':').map(Number);
  const [endHr, endMin] = endTime.split(':').map(Number);

  let current = startHr * 60 + startMin;
  const end = endHr * 60 + endMin;

  while (current + durationMinutes <= end) {
    const hr = Math.floor(current / 60);
    const min = current % 60;
    slots.push(`${String(hr).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
    current += durationMinutes;
  }

  return slots;
};

/**
 * Get the day name for a given date string (YYYY-MM-DD)
 */
const getDayName = (dateString) => {
  const date = new Date(dateString + 'T12:00:00Z'); // Use noon UTC to avoid timezone issues
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getUTCDay()];
};

module.exports = { generateSlots, getDayName };
