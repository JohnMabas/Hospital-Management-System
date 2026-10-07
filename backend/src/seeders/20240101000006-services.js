'use strict';

const { v4: uuidv4 } = require('uuid');

const departmentIds = {
  generalMedicine: 'd1b2c3d4-e5f6-7890-abcd-ef1234567801',
  pediatrics: 'd2b2c3d4-e5f6-7890-abcd-ef1234567802',
  obgyn: 'd3b2c3d4-e5f6-7890-abcd-ef1234567803',
  surgery: 'd4b2c3d4-e5f6-7890-abcd-ef1234567804',
  cardiology: 'd5b2c3d4-e5f6-7890-abcd-ef1234567805',
  dental: 'd6b2c3d4-e5f6-7890-abcd-ef1234567806',
  laboratory: 'd7b2c3d4-e5f6-7890-abcd-ef1234567807',
  radiology: 'd8b2c3d4-e5f6-7890-abcd-ef1234567808',
};

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('Services', [
      // General Medicine
      { id: uuidv4(), name: 'General Consultation', description: 'Comprehensive medical consultation with a general practitioner', price: 3000, departmentId: departmentIds.generalMedicine, isActive: true, icon: 'Stethoscope', createdAt: now, updatedAt: now },
      { id: uuidv4(), name: 'Diabetes Management', description: 'Blood sugar monitoring, medication review, and lifestyle counselling', price: 5000, departmentId: departmentIds.generalMedicine, isActive: true, icon: 'Activity', createdAt: now, updatedAt: now },
      { id: uuidv4(), name: 'Hypertension Care', description: 'Blood pressure monitoring and antihypertensive medication management', price: 4000, departmentId: departmentIds.generalMedicine, isActive: true, icon: 'HeartPulse', createdAt: now, updatedAt: now },

      // Pediatrics
      { id: uuidv4(), name: 'Child Wellness Check', description: 'Routine health check and growth monitoring for children', price: 4000, departmentId: departmentIds.pediatrics, isActive: true, icon: 'Baby', createdAt: now, updatedAt: now },
      { id: uuidv4(), name: 'Childhood Immunisation', description: 'All routine vaccinations as per Nigerian Immunisation Schedule', price: 2500, departmentId: departmentIds.pediatrics, isActive: true, icon: 'Syringe', createdAt: now, updatedAt: now },
      { id: uuidv4(), name: 'Paediatric Consultation', description: 'Specialist consultation for sick children', price: 5000, departmentId: departmentIds.pediatrics, isActive: true, icon: 'Stethoscope', createdAt: now, updatedAt: now },

      // OB/GYN
      { id: uuidv4(), name: 'Antenatal Care (ANC)', description: 'Complete antenatal care package including 8 visits, ultrasound, and tests', price: 45000, departmentId: departmentIds.obgyn, isActive: true, icon: 'Heart', createdAt: now, updatedAt: now },
      { id: uuidv4(), name: 'Normal Delivery', description: 'Supervised vaginal delivery with skilled birth attendant', price: 80000, departmentId: departmentIds.obgyn, isActive: true, icon: 'Heart', createdAt: now, updatedAt: now },
      { id: uuidv4(), name: 'Family Planning Counselling', description: 'Counselling and provision of contraceptives', price: 3000, departmentId: departmentIds.obgyn, isActive: true, icon: 'Shield', createdAt: now, updatedAt: now },
      { id: uuidv4(), name: 'Cervical Cancer Screening', description: 'Pap smear and VIA screening for cervical cancer', price: 6000, departmentId: departmentIds.obgyn, isActive: true, icon: 'Search', createdAt: now, updatedAt: now },

      // Surgery
      { id: uuidv4(), name: 'Appendectomy', description: 'Surgical removal of the appendix (open or laparoscopic)', price: 250000, departmentId: departmentIds.surgery, isActive: true, icon: 'Scissors', createdAt: now, updatedAt: now },
      { id: uuidv4(), name: 'Hernia Repair', description: 'Surgical correction of inguinal, umbilical, or incisional hernias', price: 200000, departmentId: departmentIds.surgery, isActive: true, icon: 'Scissors', createdAt: now, updatedAt: now },
      { id: uuidv4(), name: 'Wound Dressing', description: 'Professional wound care and dressing change', price: 2500, departmentId: departmentIds.surgery, isActive: true, icon: 'Bandage', createdAt: now, updatedAt: now },

      // Cardiology
      { id: uuidv4(), name: 'ECG (Electrocardiogram)', description: '12-lead ECG with interpretation', price: 8000, departmentId: departmentIds.cardiology, isActive: true, icon: 'Activity', createdAt: now, updatedAt: now },
      { id: uuidv4(), name: 'Echocardiography', description: 'Ultrasound imaging of the heart', price: 25000, departmentId: departmentIds.cardiology, isActive: true, icon: 'HeartPulse', createdAt: now, updatedAt: now },
      { id: uuidv4(), name: 'Cardiac Consultation', description: 'Specialist consultation with a consultant cardiologist', price: 15000, departmentId: departmentIds.cardiology, isActive: true, icon: 'Stethoscope', createdAt: now, updatedAt: now },

      // Dental
      { id: uuidv4(), name: 'Dental Check-up', description: 'Comprehensive oral examination and professional cleaning', price: 5000, departmentId: departmentIds.dental, isActive: true, icon: 'SmilePlus', createdAt: now, updatedAt: now },
      { id: uuidv4(), name: 'Tooth Extraction', description: 'Simple or surgical tooth removal', price: 8000, departmentId: departmentIds.dental, isActive: true, icon: 'Scissors', createdAt: now, updatedAt: now },
      { id: uuidv4(), name: 'Dental Filling', description: 'Composite resin filling for cavities', price: 12000, departmentId: departmentIds.dental, isActive: true, icon: 'SmilePlus', createdAt: now, updatedAt: now },
      { id: uuidv4(), name: 'Teeth Whitening', description: 'Professional in-office teeth whitening treatment', price: 35000, departmentId: departmentIds.dental, isActive: true, icon: 'Sparkles', createdAt: now, updatedAt: now },

      // Laboratory
      { id: uuidv4(), name: 'Full Blood Count (FBC)', description: 'Complete blood count including differential', price: 2500, departmentId: departmentIds.laboratory, isActive: true, icon: 'FlaskConical', createdAt: now, updatedAt: now },
      { id: uuidv4(), name: 'Malaria Parasite Test', description: 'Rapid diagnostic test and blood film for malaria', price: 2000, departmentId: departmentIds.laboratory, isActive: true, icon: 'Microscope', createdAt: now, updatedAt: now },
      { id: uuidv4(), name: 'HIV Screening', description: 'Rapid HIV 1&2 antibody test (confidential)', price: 1500, departmentId: departmentIds.laboratory, isActive: true, icon: 'Shield', createdAt: now, updatedAt: now },
      { id: uuidv4(), name: 'Lipid Profile', description: 'Total cholesterol, HDL, LDL, triglycerides', price: 6000, departmentId: departmentIds.laboratory, isActive: true, icon: 'Activity', createdAt: now, updatedAt: now },
      { id: uuidv4(), name: 'Blood Sugar (FBS/RBS)', description: 'Fasting or random blood sugar test', price: 1500, departmentId: departmentIds.laboratory, isActive: true, icon: 'Droplets', createdAt: now, updatedAt: now },

      // Radiology
      { id: uuidv4(), name: 'Chest X-Ray', description: 'PA chest X-ray with radiologist report', price: 5000, departmentId: departmentIds.radiology, isActive: true, icon: 'ScanLine', createdAt: now, updatedAt: now },
      { id: uuidv4(), name: 'Abdominal Ultrasound', description: 'Ultrasound scan of abdomen and pelvis', price: 12000, departmentId: departmentIds.radiology, isActive: true, icon: 'ScanLine', createdAt: now, updatedAt: now },
      { id: uuidv4(), name: 'Obstetric Ultrasound', description: 'Pregnancy scan (dating, anomaly, growth)', price: 8000, departmentId: departmentIds.radiology, isActive: true, icon: 'ScanLine', createdAt: now, updatedAt: now },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Services', null, {});
  },
};
