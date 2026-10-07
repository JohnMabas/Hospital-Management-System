'use strict';

const { v4: uuidv4 } = require('uuid');

const adminId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('BlogPosts', [
      {
        id: uuidv4(),
        title: 'Understanding Malaria Prevention in Plateau State',
        slug: 'understanding-malaria-prevention-plateau-state',
        excerpt: 'Malaria remains one of the most prevalent diseases in Nigeria. Learn how you can protect yourself and your family during the rainy season in Jos.',
        content: `<p>Malaria is caused by the Plasmodium parasite and is transmitted through the bite of infected female Anopheles mosquitoes. In Plateau State, the risk increases significantly during the rainy season (April to October).</p>
<h2>Prevention Strategies</h2>
<ul>
<li><strong>Use insecticide-treated bed nets (ITNs):</strong> Sleep under a treated net every night, especially for children under 5 and pregnant women.</li>
<li><strong>Indoor Residual Spraying (IRS):</strong> Allow government spraying programmes into your home.</li>
<li><strong>Eliminate stagnant water:</strong> Empty containers, clear gutters, and cover water storage tanks.</li>
<li><strong>Wear protective clothing:</strong> Long sleeves and trousers in the evenings.</li>
<li><strong>Seek prompt treatment:</strong> If you develop fever, chills, or headache, visit a healthcare facility immediately.</li>
</ul>
<h2>Know the Symptoms</h2>
<p>Symptoms include fever, chills, headache, muscle aches, fatigue, nausea, and vomiting. Children may also experience seizures. Malaria can progress rapidly to severe disease if untreated.</p>
<p>At CareBridge Specialist Hospital, we offer rapid malaria diagnostic tests and effective treatment. Do not rely on self-medication — antimalarial resistance is a growing concern.</p>`,
        authorId: adminId,
        imageUrl: null,
        category: 'Infectious Diseases',
        tags: ['{"malaria","prevention","plateau-state","mosquito"}'],
        isPublished: true,
        publishedAt: new Date('2024-06-15'),
        viewCount: 342,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        title: 'Hypertension: The Silent Killer — What Every Nigerian Must Know',
        slug: 'hypertension-silent-killer-nigeria',
        excerpt: 'High blood pressure affects 1 in 3 Nigerian adults yet most do not know they have it. Regular screening can save your life.',
        content: `<p>Hypertension, or high blood pressure, is blood pressure consistently above 140/90 mmHg. It is called the "silent killer" because most people have no symptoms until serious complications like stroke, heart attack, or kidney failure occur.</p>
<h2>Risk Factors Common in Nigeria</h2>
<ul>
<li>High salt intake (from seasoning cubes, smoked fish, and processed foods)</li>
<li>Obesity and physical inactivity</li>
<li>Excessive alcohol consumption</li>
<li>Smoking</li>
<li>Chronic stress</li>
<li>Family history</li>
</ul>
<h2>How to Check Your Blood Pressure</h2>
<p>Visit any CareBridge clinic for a free blood pressure check. Normal blood pressure is below 120/80 mmHg. We recommend annual screening for all adults above 18 years.</p>
<h2>Treatment</h2>
<p>Lifestyle changes are the first line of treatment. These include reducing salt intake, exercising for at least 30 minutes most days, maintaining a healthy weight, limiting alcohol, and stopping smoking. Medication may also be prescribed by your doctor.</p>`,
        authorId: adminId,
        imageUrl: null,
        category: 'Cardiovascular Health',
        tags: ['{"hypertension","blood-pressure","heart-health","prevention"}'],
        isPublished: true,
        publishedAt: new Date('2024-07-20'),
        viewCount: 512,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        title: 'Antenatal Care: Why Every Pregnancy Visit Matters',
        slug: 'antenatal-care-why-every-visit-matters',
        excerpt: 'Many maternal deaths in Nigeria are preventable. Learn why consistent antenatal care is critical for you and your baby.',
        content: `<p>Nigeria has one of the highest maternal mortality rates in the world. Most of these deaths are preventable through skilled antenatal care, skilled birth attendance, and emergency obstetric care.</p>
<h2>The 8 ANC Contacts</h2>
<p>The WHO recommends a minimum of 8 antenatal care contacts throughout pregnancy. At CareBridge, our ANC package covers:</p>
<ul>
<li>Booking visit: Blood tests, urine tests, blood pressure check, weight, height, HIV/hepatitis screening</li>
<li>Regular monitoring of weight, blood pressure, and baby's growth</li>
<li>Iron and folic acid supplementation</li>
<li>Tetanus toxoid vaccination</li>
<li>Malaria prevention in pregnancy (IPTp)</li>
<li>Ultrasound scans at appropriate intervals</li>
<li>Birth preparedness counselling</li>
</ul>
<h2>Warning Signs During Pregnancy</h2>
<p>Seek immediate care if you experience: severe headache, blurred vision, swelling of face/hands, vaginal bleeding, decreased or absent fetal movement, or fever with chills.</p>`,
        authorId: adminId,
        imageUrl: null,
        category: 'Maternal Health',
        tags: ['{"antenatal","pregnancy","maternal-health","women-health"}'],
        isPublished: true,
        publishedAt: new Date('2024-08-05'),
        viewCount: 287,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        title: 'Childhood Vaccination Schedule in Nigeria — A Parent\'s Guide',
        slug: 'childhood-vaccination-schedule-nigeria-parents-guide',
        excerpt: 'Vaccines protect your child from dangerous diseases. Here is the complete National Programme on Immunisation (NPI) schedule.',
        content: `<p>Vaccination is one of the most cost-effective public health interventions available. The Nigerian National Programme on Immunisation (NPI) provides free vaccines at government health facilities. At CareBridge, we offer all NPI vaccines plus additional recommended vaccines.</p>
<h2>NPI Vaccine Schedule</h2>
<ul>
<li><strong>At birth:</strong> BCG (TB), Oral Polio Vaccine 0, Hepatitis B 1</li>
<li><strong>6 weeks:</strong> DPT-HepB-Hib 1, OPV 1, PCV 1, Rota 1</li>
<li><strong>10 weeks:</strong> DPT-HepB-Hib 2, OPV 2, PCV 2, Rota 2</li>
<li><strong>14 weeks:</strong> DPT-HepB-Hib 3, OPV 3, PCV 3, IPV</li>
<li><strong>6 months:</strong> Vitamin A supplementation</li>
<li><strong>9 months:</strong> Measles 1, Yellow Fever, Meningitis A (MenAfriVac)</li>
<li><strong>15 months:</strong> Measles 2</li>
</ul>
<p>Bring your child's health card to every visit so we can track their immunisation history.</p>`,
        authorId: adminId,
        imageUrl: null,
        category: 'Child Health',
        tags: ['{"vaccination","immunisation","children","NPI","pediatrics"}'],
        isPublished: true,
        publishedAt: new Date('2024-09-01'),
        viewCount: 423,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        title: 'Diabetes Management: Living Well with Type 2 Diabetes in Nigeria',
        slug: 'diabetes-management-living-well-type-2-nigeria',
        excerpt: 'Type 2 diabetes is increasingly common in Nigeria. With the right information and care, you can live a full, healthy life.',
        content: `<p>Type 2 diabetes affects approximately 5.7% of Nigerian adults. With urbanisation, changing diets, and reduced physical activity, this number is rising. The good news is that diabetes can be well managed with the right approach.</p>
<h2>Understanding Your Blood Sugar</h2>
<p>Normal fasting blood sugar is 70–100 mg/dL. In diabetes, the goal is to keep fasting sugar below 130 mg/dL and post-meal sugar below 180 mg/dL.</p>
<h2>Diet Tips for Nigerians with Diabetes</h2>
<ul>
<li>Choose unprocessed carbohydrates: oats, brown rice, whole grain bread, yam</li>
<li>Eat more vegetables: ugwu (fluted pumpkin), bitter leaf, okra, garden egg</li>
<li>Reduce white rice, eba, and fufu portions</li>
<li>Limit sugar-sweetened drinks — including zobo and kunu with added sugar</li>
<li>Eat 3 regular meals at consistent times</li>
</ul>
<h2>Exercise</h2>
<p>Aim for at least 150 minutes of moderate exercise per week. Brisk walking, cycling, and swimming are excellent choices.</p>
<h2>Monitoring</h2>
<p>Check your blood sugar as directed by your doctor. Attend all follow-up appointments and have your HbA1c tested every 3 months.</p>`,
        authorId: adminId,
        imageUrl: null,
        category: 'Chronic Disease',
        tags: ['{"diabetes","blood-sugar","nutrition","chronic-disease"}'],
        isPublished: true,
        publishedAt: new Date('2024-09-20'),
        viewCount: 389,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert('Testimonials', [
      {
        id: uuidv4(),
        name: 'Mrs. Blessing Yakubu',
        role: 'Patient, Jos North',
        message: 'CareBridge Specialist Hospital is simply the best in Jos. I went in for my antenatal care and the doctors were so thorough and compassionate. The facility is clean and the nurses are kind. I delivered my baby safely and I could not be happier. God bless this hospital!',
        rating: 5,
        avatarUrl: null,
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Mr. Gideon Pam',
        role: 'Patient, Barkin Ladi',
        message: 'I was diagnosed with hypertension two years ago and I have been under the care of Dr. Okonkwo since then. My blood pressure is now well controlled and I feel great. The doctor takes time to explain everything and answers all my questions. CareBridge is a world-class hospital right here in Jos.',
        rating: 5,
        avatarUrl: null,
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Mrs. Aisha Suleiman',
        role: 'Mother of 3, Bukuru',
        message: 'My youngest son was very sick with severe malaria and pneumonia. We rushed him to CareBridge at midnight and the emergency team attended to him immediately. He was admitted for 5 days and the paediatric team were exceptional. Today he is perfectly fine. I will never forget how this hospital saved my son\'s life.',
        rating: 5,
        avatarUrl: null,
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Pastor Emmanuel Dogo',
        role: 'Patient, Jos South',
        message: 'After my cardiac evaluation at CareBridge, Dr. Ikechukwu found that I had a serious heart condition I did not know about. He explained my diagnosis clearly and started me on treatment. The cardiology department is fully equipped and the team is very professional. I recommend CareBridge to everyone.',
        rating: 5,
        avatarUrl: null,
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Miss Fatima Haruna',
        role: 'Patient, Rayfield, Jos',
        message: 'I finally overcame my fear of dentists at CareBridge! Dr. Abdullahi is so gentle and reassuring. I had two extractions and could barely feel anything. The dental suite is modern and spotless. I now bring my whole family here for dental care. Thank you CareBridge!',
        rating: 5,
        avatarUrl: null,
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Mr. Sunday Lawal',
        role: 'Patient, Angwan Rogo, Jos',
        message: 'I underwent surgery for hernia repair at CareBridge and the experience was excellent from start to finish. The surgical team explained everything beforehand, the anaesthesia was smooth, and the post-operative care was superb. I was discharged in two days and recovered fully within two weeks. Thank you Dr. Eze and the entire surgery team.',
        rating: 4,
        avatarUrl: null,
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('BlogPosts', null, {});
    await queryInterface.bulkDelete('Testimonials', null, {});
  },
};
