'use strict';

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

    await queryInterface.bulkInsert('Departments', [
      {
        id: departmentIds.generalMedicine,
        name: 'General Medicine',
        description: 'Comprehensive primary care for adults covering diagnosis and treatment of a wide range of medical conditions. Our general practitioners provide holistic healthcare including chronic disease management, preventive care, and health screenings.',
        icon: 'Stethoscope',
        imageUrl: null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: departmentIds.pediatrics,
        name: 'Pediatrics',
        description: 'Specialized medical care for infants, children, and adolescents up to age 18. Our pediatric team provides vaccinations, growth monitoring, treatment of childhood illnesses, and developmental assessments in a child-friendly environment.',
        icon: 'Baby',
        imageUrl: null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: departmentIds.obgyn,
        name: 'Obstetrics & Gynaecology',
        description: 'Expert care for women at every stage of life. Services include antenatal care, safe delivery, postnatal care, family planning, treatment of gynaecological conditions, and minimally invasive surgery.',
        icon: 'Heart',
        imageUrl: null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: departmentIds.surgery,
        name: 'General Surgery',
        description: 'Advanced surgical services covering a broad spectrum of conditions. Our experienced surgeons perform elective and emergency procedures including appendectomy, hernia repair, gallbladder surgery, and trauma surgery.',
        icon: 'Scissors',
        imageUrl: null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: departmentIds.cardiology,
        name: 'Cardiology',
        description: 'Comprehensive heart and vascular care using state-of-the-art diagnostic equipment. Services include ECG, echocardiography, stress tests, management of hypertension, heart failure, and arrhythmias.',
        icon: 'HeartPulse',
        imageUrl: null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: departmentIds.dental,
        name: 'Dental Care',
        description: 'Complete oral health services for the whole family. From routine check-ups and cleanings to restorative procedures like fillings and crowns, orthodontics, teeth whitening, and oral surgery.',
        icon: 'SmilePlus',
        imageUrl: null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: departmentIds.laboratory,
        name: 'Laboratory Services',
        description: 'Accredited diagnostic laboratory offering a full range of clinical tests including full blood count, malaria parasite, typhoid test, HIV screening, hepatitis screening, lipid profile, blood sugar, and urine analysis.',
        icon: 'FlaskConical',
        imageUrl: null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: departmentIds.radiology,
        name: 'Radiology & Imaging',
        description: 'Modern diagnostic imaging services including X-ray, ultrasound, and CT scan interpretations. Our radiologists provide accurate and timely reports to guide clinical decision-making.',
        icon: 'ScanLine',
        imageUrl: null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Departments', null, {});
  },
};

module.exports.departmentIds = departmentIds;
