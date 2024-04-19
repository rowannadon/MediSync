export type Person = {
  id: number;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  admin: boolean;
  location: string;
};

export const displayedPeople = [
  {
    id: 1,
    name: 'John Doe',
    role: 'Administrator',
    department: 'Information Technology',
    phone: '555-555-5555',
    email: 'john.d@hospital.org',
    admin: true,
    location: 'Room 101',
  },
  {
    id: 2,
    name: 'Jane Doe',
    role: 'Nurse',
    department: 'Emergency',
    phone: '555-523-7234',
    email: 'jane.d@hospital.org',
    admin: false,
    location: 'Room 102',
  },
  {
    id: 3,
    name: 'Jack Doe',
    role: 'Physician',
    department: 'Cardiology',
    phone: '555-123-5566',
    email: 'jack.d@hospital.org',
    admin: false,
    location: 'Room 103',
  },
  {
    id: 4,
    name: 'Jill Doe',
    role: 'Nurse',
    department: 'Radiology',
    phone: '555-442-1454',
    email: 'j.doe@hospital.org',
    admin: false,
    location: 'Room 104',
  },
  {
    id: 7,
    name: 'Emily Smith',
    role: 'Nurse',
    department: 'Pediatrics',
    phone: '555-987-6543',
    email: 'emily.s@hospital.org',
    admin: false,
    location: 'Room 215',
  },
  {
    id: 12,
    name: 'Michael Johnson',
    role: 'Surgeon',
    department: 'Orthopedics',
    phone: '555-456-7890',
    email: 'michael.j@hospital.org',
    admin: true,
    location: 'Operating Room 1',
  },
  {
    id: 19,
    name: 'Sarah Williams',
    role: 'Anesthesiologist',
    department: 'Anesthesia',
    phone: '555-321-0987',
    email: 'sarah.w@hospital.org',
    admin: false,
    location: 'Operating Room 3',
  },
  {
    id: 24,
    name: 'Christopher Brown',
    role: 'Physician Assistant',
    department: 'Emergency Medicine',
    phone: '555-876-5432',
    email: 'christopher.b@hospital.org',
    admin: false,
    location: 'Emergency Department',
  },
  {
    id: 31,
    name: 'Jessica Garcia',
    role: 'Registered Nurse',
    department: 'Intensive Care Unit',
    phone: '555-234-5678',
    email: 'jessica.g@hospital.org',
    admin: false,
    location: 'ICU Ward 2',
  },
  {
    id: 38,
    name: 'William Martinez',
    role: 'Radiologist',
    department: 'Radiology',
    phone: '555-789-0123',
    email: 'william.m@hospital.org',
    admin: false,
    location: 'Radiology Department',
  },
  {
    id: 43,
    name: 'Amanda Davis',
    role: 'Medical Technologist',
    department: 'Laboratory',
    phone: '555-543-2109',
    email: 'amanda.d@hospital.org',
    admin: false,
    location: 'Lab Room 4',
  },
  {
    id: 50,
    name: 'James Wilson',
    role: 'Physical Therapist',
    department: 'Rehabilitation Services',
    phone: '555-210-9876',
    email: 'james.w@hospital.org',
    admin: false,
    location: 'Physical Therapy Gym',
  },
  {
    id: 55,
    name: 'Jennifer Taylor',
    role: 'Clinical Psychologist',
    department: 'Psychiatry',
    phone: '555-678-9012',
    email: 'jennifer.t@hospital.org',
    admin: false,
    location: 'Psychiatry Office',
  },
  {
    id: 62,
    name: 'John Rodriguez',
    role: 'Respiratory Therapist',
    department: 'Respiratory Care',
    phone: '555-901-2345',
    email: 'john.r@hospital.org',
    admin: false,
    location: 'Respiratory Therapy Unit',
  },
  {
    id: 60,
    name: 'Emily Thompson',
    role: 'Registered Nurse',
    department: 'Emergency Medicine',
    phone: '555-123-4567',
    email: 'emily.t@hospital.org',
    admin: false,
    location: 'Emergency Room',
  },
  {
    id: 65,
    name: 'Michael Nguyen',
    role: 'Anesthesiologist',
    department: 'Anesthesiology',
    phone: '555-789-0123',
    email: 'michael.n@hospital.org',
    admin: false,
    location: 'Operating Room',
  },
  {
    id: 70,
    name: 'Sarah Martinez',
    role: 'Occupational Therapist',
    department: 'Rehabilitation Services',
    phone: '555-345-6789',
    email: 'sarah.m@hospital.org',
    admin: false,
    location: 'Occupational Therapy Room',
  },
  {
    id: 75,
    name: 'Christopher Lee',
    role: 'Radiologic Technologist',
    department: 'Radiology',
    phone: '555-890-1234',
    email: 'christopher.l@hospital.org',
    admin: false,
    location: 'Radiology Department',
  },
  {
    id: 80,
    name: 'Jessica Brown',
    role: 'Speech-Language Pathologist',
    department: 'Speech Therapy',
    phone: '555-234-5678',
    email: 'jessica.b@hospital.org',
    admin: false,
    location: 'Speech Therapy Clinic',
  },
  {
    id: 85,
    name: 'Matthew Garcia',
    role: 'Pharmacist',
    department: 'Pharmacy',
    phone: '555-678-9012',
    email: 'matthew.g@hospital.org',
    admin: false,
    location: 'Pharmacy Department',
  },
  {
    id: 90,
    name: 'Amanda Clark',
    role: 'Medical Technologist',
    department: 'Laboratory',
    phone: '555-123-4567',
    email: 'amanda.c@hospital.org',
    admin: false,
    location: 'Laboratory',
  },
  {
    id: 95,
    name: 'Ryan Baker',
    role: 'Cardiologist',
    department: 'Cardiology',
    phone: '555-234-5678',
    email: 'ryan.b@hospital.org',
    admin: false,
    location: 'Cardiology Clinic',
  },
  {
    id: 100,
    name: 'Lauren White',
    role: 'Neurologist',
    department: 'Neurology',
    phone: '555-345-6789',
    email: 'lauren.w@hospital.org',
    admin: false,
    location: 'Neurology Department',
  },

  {
    id: 101,
    name: 'Olivia Johnson',
    role: 'Nurse',
    department: 'Pediatrics',
    phone: '555-987-6543',
    email: 'olivia.j@hospital.org',
    admin: false,
    location: 'Pediatrics Wing',
  },

  {
    id: 105,
    name: 'Daniel Scott',
    role: 'Medical Social Worker',
    department: 'Social Services',
    phone: '555-456-7890',
    email: 'daniel.s@hospital.org',
    admin: false,
    location: 'Social Services Office',
  },
  {
    id: 110,
    name: 'Olivia Wilson',
    role: 'Registered Nurse',
    department: 'Pediatrics',
    phone: '555-567-8901',
    email: 'olivia.w@hospital.org',
    admin: false,
    location: 'Pediatric Ward',
  },
  {
    id: 115,
    name: 'Ethan Thomas',
    role: 'Registered Nurse',
    department: 'Intensive Care Unit',
    phone: '555-678-9012',
    email: 'ethan.t@hospital.org',
    admin: false,
    location: 'ICU',
  },
  {
    id: 120,
    name: 'Sophia Martinez',
    role: 'Registered Nurse',
    department: 'Surgery',
    phone: '555-789-0123',
    email: 'sophia.m@hospital.org',
    admin: false,
    location: 'Surgical Ward',
  },
  {
    id: 125,
    name: 'Alexander Nguyen',
    role: 'Physician',
    department: 'Emergency Medicine',
    phone: '555-890-1234',
    email: 'alexander.n@hospital.org',
    admin: false,
    location: 'Emergency Room',
  },
  {
    id: 130,
    name: 'Isabella Garcia',
    role: 'Physician',
    department: 'Internal Medicine',
    phone: '555-901-2345',
    email: 'isabella.g@hospital.org',
    admin: false,
    location: 'Internal Medicine Clinic',
  },
  {
    id: 135,
    name: 'Mason Lopez',
    role: 'Physician',
    department: 'Family Medicine',
    phone: '555-012-3456',
    email: 'mason.l@hospital.org',
    admin: false,
    location: 'Family Medicine Clinic',
  },
  {
    id: 140,
    name: 'Amelia Clark',
    role: 'Physician',
    department: 'Obstetrics and Gynecology',
    phone: '555-123-4567',
    email: 'amelia.c@hospital.org',
    admin: false,
    location: 'OB/GYN Clinic',
  },
  {
    id: 145,
    name: 'William Baker',
    role: 'Physician',
    department: 'Cardiology',
    phone: '555-234-5678',
    email: 'william.b@hospital.org',
    admin: false,
    location: 'Cardiology Clinic',
  },
  {
    id: 150,
    name: 'Chloe White',
    role: 'Physician',
    department: 'Dermatology',
    phone: '555-345-6789',
    email: 'chloe.w@hospital.org',
    admin: false,
    location: 'Dermatology Clinic',
  },
  {
    id: 155,
    name: 'Benjamin Scott',
    role: 'Physician',
    department: 'Orthopedics',
    phone: '555-456-7890',
    email: 'benjamin.s@hospital.org',
    admin: false,
    location: 'Orthopedic Clinic',
  },
  {
    id: 160,
    name: 'Emma Johnson',
    role: 'Administrative Assistant',
    department: 'Administration',
    phone: '555-567-8901',
    email: 'emma.j@hospital.org',
    admin: true,
    location: 'Administration Office',
  },
  {
    id: 165,
    name: 'Noah Martinez',
    role: 'Human Resources Coordinator',
    department: 'Human Resources',
    phone: '555-678-9012',
    email: 'noah.m@hospital.org',
    admin: true,
    location: 'Human Resources Office',
  },
  {
    id: 170,
    name: 'Ava Brown',
    role: 'Billing Specialist',
    department: 'Finance',
    phone: '555-789-0123',
    email: 'ava.b@hospital.org',
    admin: true,
    location: 'Finance Department',
  },
  {
    id: 175,
    name: 'Liam Davis',
    role: 'IT Support Technician',
    department: 'Information Technology',
    phone: '555-890-1234',
    email: 'liam.d@hospital.org',
    admin: true,
    location: 'IT Department',
  },
  {
    id: 180,
    name: 'Mia Garcia',
    role: 'Quality Assurance Manager',
    department: 'Quality Assurance',
    phone: '555-901-2345',
    email: 'mia.g@hospital.org',
    admin: true,
    location: 'Quality Assurance Office',
  },
  {
    id: 185,
    name: 'Jacob Rodriguez',
    role: 'Facilities Manager',
    department: 'Facilities Management',
    phone: '555-012-3456',
    email: 'jacob.r@hospital.org',
    admin: true,
    location: 'Facilities Management Office',
  },
  {
    id: 190,
    name: 'Sophie Wilson',
    role: 'Patient Services Coordinator',
    department: 'Patient Services',
    phone: '555-123-4567',
    email: 'sophie.w@hospital.org',
    admin: true,
    location: 'Patient Services Office',
  },
  {
    id: 195,
    name: 'Elijah Thompson',
    role: 'Medical Records Clerk',
    department: 'Medical Records',
    phone: '555-234-5678',
    email: 'elijah.t@hospital.org',
    admin: true,
    location: 'Medical Records Department',
  },
  {
    id: 200,
    name: 'Avery Martinez',
    role: 'Patient Accounts Representative',
    department: 'Finance',
    phone: '555-345-6789',
    email: 'avery.m@hospital.org',
    admin: true,
    location: 'Finance Department',
  },
  {
    id: 202,
    name: 'Liam Rodriguez',
    role: 'Emergency Room Physician',
    department: 'Emergency Medicine',
    phone: '555-222-3333',
    email: 'liam.r@hospital.org',
    admin: false,
    location: 'Emergency Department',
  },
  {
    id: 205,
    name: 'Harper Brown',
    role: 'Compliance Officer',
    department: 'Compliance',
    phone: '555-456-7890',
    email: 'harper.b@hospital.org',
    admin: true,
    location: 'Compliance Office',
  },
  {
    id: 303,
    name: 'Ava Martinez',
    role: 'Medical Technologist',
    department: 'Laboratory',
    phone: '555-777-8888',
    email: 'ava.m@hospital.org',
    admin: false,
    location: 'Lab Facility',
  },
  {
    id: 404,
    name: 'Noah Thompson',
    role: 'Radiologist',
    department: 'Radiology',
    phone: '555-444-5555',
    email: 'noah.t@hospital.org',
    admin: false,
    location: 'Radiology Department',
  },

  {
    id: 505,
    name: 'Isabella White',
    role: 'Pharmacist',
    department: 'Pharmacy',
    phone: '555-333-1111',
    email: 'isabella.w@hospital.org',
    admin: false,
    location: 'Pharmacy Area',
  },
  {
    id: 606,
    name: 'Mason Lee',
    role: 'Patient Care Technician',
    department: 'Nursing',
    phone: '555-666-7777',
    email: 'mason.l@hospital.org',
    admin: false,
    location: 'Nursing Station',
  },
  {
    id: 707,
    name: 'Sophia Harris',
    role: 'Physical Therapist',
    department: 'Rehabilitation',
    phone: '555-888-9999',
    email: 'sophia.h@hospital.org',
    admin: false,
    location: 'Rehabilitation Center',
  },
  {
    id: 808,
    name: 'William Clark',
    role: 'Anesthesiologist',
    department: 'Anesthesiology',
    phone: '555-444-2222',
    email: 'william.c@hospital.org',
    admin: true,
    location: 'Operating Room',
  },
  {
    id: 909,
    name: 'Charlotte Turner',
    role: 'Occupational Therapist',
    department: 'Occupational Therapy',
    phone: '555-222-8888',
    email: 'charlotte.t@hospital.org',
    admin: false,
    location: 'Occupational Therapy Unit',
  },
  {
    id: 1010,
    name: 'Daniel Baker',
    role: 'Psychiatrist',
    department: 'Psychiatry',
    phone: '555-999-3333',
    email: 'daniel.b@hospital.org',
    admin: false,
    location: 'Psychiatry Clinic',
  },
  {
    id: 1111,
    name: 'Amelia Young',
    role: 'Clinical Psychologist',
    department: 'Psychology',
    phone: '555-777-5555',
    email: 'amelia.y@hospital.org',
    admin: false,
    location: 'Psychology Department',
  },
  {
    id: 1212,
    name: 'James Hernandez',
    role: 'Medical Social Worker',
    department: 'Social Services',
    phone: '555-333-6666',
    email: 'james.h@hospital.org',
    admin: false,
    location: 'Social Work Office',
  },
  {
    id: 1313,
    name: 'Evelyn King',
    role: 'Dietitian',
    department: 'Nutrition Services',
    phone: '555-222-7777',
    email: 'evelyn.k@hospital.org',
    admin: false,
    location: 'Nutrition Department',
  },
  {
    id: 1414,
    name: 'Pat Scott',
    role: 'Medical Librarian',
    department: 'Library',
    phone: '555-888-4444',
    email: 'benjamin.s@hospital.org',
    admin: false,
    location: 'Medical Library',
  },
  {
    id: 1515,
    name: 'Harper Evans',
    role: 'Patient Advocate',
    department: 'Patient Relations',
    phone: '555-111-7777',
    email: 'harper.e@hospital.org',
    admin: false,
    location: 'Patient Advocacy Office',
  },
];
// end of Person
export type Equipment = {
  type: string;
  count: number;
  desc: string;
};

export type Occupancy = {
  current: number;
  total: number;
};

export type HospitalRoom = {
  room_number: number;
  type: string;
  equipment: Equipment[];
  occupancy: Occupancy;
};

export const displayedRooms: HospitalRoom[] = [
  {
    room_number: 223,
    type: 'X-Ray Room',
    equipment: [{ type: 'x-ray machine', count: 2, desc: 'X-ray Machine' }],
    occupancy: { current: 0, total: 2 },
  },
  {
    room_number: 102,
    type: 'Intensive Care Unit',
    equipment: [
      { type: 'bed', count: 2, desc: 'ICU beds with advanced monitoring' },
      { type: 'ventilator', count: 2, desc: 'Mechanical ventilators' },
      {
        type: 'vital_sign_monitor',
        count: 2,
        desc: 'Advanced patient monitoring systems',
      },
    ],
    occupancy: { current: 2, total: 4 },
  },
  {
    room_number: 103,
    type: 'Operating Room',
    equipment: [
      { type: 'surgical_table', count: 1, desc: 'Motorized operating table' },
      {
        type: 'anesthesia_machine',
        count: 1,
        desc: 'General anesthesia delivery system',
      },
      { type: 'surgical_lights', count: 4, desc: 'Overhead surgical lighting' },
      {
        type: 'electrosurgical_unit',
        count: 1,
        desc: 'Device for cutting and coagulating tissue',
      },
    ],
    occupancy: { current: 1, total: 1 },
  },
  {
    room_number: 104,
    type: 'Emergency Room',
    equipment: [
      {
        type: 'gurney',
        count: 4,
        desc: 'Portable hospital beds for emergency care',
      },
      {
        type: 'defibrillator',
        count: 2,
        desc: 'Devices for restoring normal heart rhythm',
      },
      {
        type: 'oxygen_tank',
        count: 6,
        desc: 'Compressed oxygen for respiratory support',
      },
      { type: 'suture_kit', count: 4, desc: 'Sterile kits for wound closure' },
    ],
    occupancy: { current: 3, total: 4 },
  },
  {
    room_number: 105,
    type: 'Pediatric Ward',
    equipment: [
      { type: 'pediatric_bed', count: 6, desc: 'Beds designed for children' },
      { type: 'crib', count: 4, desc: 'Cribs for infants and toddlers' },
      {
        type: 'nebulizer',
        count: 2,
        desc: 'Devices for delivering aerosolized medication',
      },
      {
        type: 'toy_chest',
        count: 1,
        desc: 'Cabinet with age-appropriate toys',
      },
    ],
    occupancy: { current: 5, total: 6 },
  },
  {
    room_number: 106,
    type: 'Maternity Ward',
    equipment: [
      {
        type: 'birthing_bed',
        count: 4,
        desc: 'Specialized beds for labor and delivery',
      },
      {
        type: 'infant_warmer',
        count: 2,
        desc: 'Devices to maintain newborn body temperature',
      },
      {
        type: 'breast_pump',
        count: 2,
        desc: 'Electric devices for expressing breast milk',
      },
      { type: 'baby_scale', count: 1, desc: 'Scale for weighing newborns' },
    ],
    occupancy: { current: 3, total: 4 },
  },
  {
    room_number: 107,
    type: 'Rehabilitation Gym',
    equipment: [
      {
        type: 'treadmill',
        count: 2,
        desc: 'Motorized walking surfaces for physical therapy',
      },
      {
        type: 'stationary_bike',
        count: 3,
        desc: 'Exercise bikes for lower-body rehabilitation',
      },
      {
        type: 'parallel_bars',
        count: 1,
        desc: 'Supports for gait and balance training',
      },
      {
        type: 'exercise_mats',
        count: 10,
        desc: 'Padded mats for floor-based exercises',
      },
    ],
    occupancy: { current: 4, total: 15 },
  },
  {
    room_number: 108,
    type: 'Imaging Suite',
    equipment: [
      {
        type: 'CT_scanner',
        count: 1,
        desc: 'Computed tomography imaging device',
      },
      {
        type: 'MRI_machine',
        count: 1,
        desc: 'Magnetic resonance imaging device',
      },
      {
        type: 'ultrasound_machine',
        count: 2,
        desc: 'Devices for diagnostic sonography',
      },
      {
        type: 'x_ray_machine',
        count: 1,
        desc: 'Equipment for radiographic imaging',
      },
    ],
    occupancy: { current: 1, total: 4 },
  },
  {
    room_number: 109,
    type: 'Laboratory',
    equipment: [
      {
        type: 'centrifuge',
        count: 2,
        desc: 'Devices for separating blood components',
      },
      {
        type: 'microscope',
        count: 4,
        desc: 'Instruments for analyzing cellular samples',
      },
      {
        type: 'incubator',
        count: 1,
        desc: 'Environment for culturing microorganisms',
      },
      {
        type: 'analytical_balance',
        count: 1,
        desc: 'Precision scale for weighing samples',
      },
    ],
    occupancy: { current: 2, total: 4 },
  },
  {
    room_number: 110,
    type: 'Pharmacy',
    equipment: [
      {
        type: 'medication_storage_cabinet',
        count: 4,
        desc: 'Secure cabinets for drug storage',
      },
      {
        type: 'automated_dispensing_machine',
        count: 2,
        desc: 'Devices for preparing and dispensing medications',
      },
      {
        type: 'compounding_station',
        count: 1,
        desc: 'Area for mixing and preparing custom medications',
      },
      {
        type: 'refrigerator',
        count: 1,
        desc: 'Unit for storing temperature-sensitive drugs',
      },
    ],
    occupancy: { current: 2, total: 2 },
  },
  {
    room_number: 111,
    type: 'Dietary Kitchen',
    equipment: [
      {
        type: 'commercial_oven',
        count: 1,
        desc: 'High-capacity oven for food preparation',
      },
      {
        type: 'industrial_mixer',
        count: 1,
        desc: 'Large-scale device for mixing ingredients',
      },
      {
        type: 'refrigerator',
        count: 2,
        desc: 'Units for storing perishable food items',
      },
      {
        type: 'food_processor',
        count: 2,
        desc: 'Machines for chopping, shredding, and pureeing',
      },
    ],
    occupancy: { current: 2, total: 4 },
  },
  {
    room_number: 112,
    type: 'Cardiology Clinic',
    equipment: [
      {
        type: 'EKG_machine',
        count: 2,
        desc: 'Devices for recording electrical activity of the heart',
      },
      {
        type: 'echocardiogram_machine',
        count: 1,
        desc: 'Ultrasound system for imaging the heart',
      },
      {
        type: 'cardiac_stress_test_equipment',
        count: 1,
        desc: 'Treadmill and monitoring devices for stress tests',
      },
      {
        type: 'patient_exam_table',
        count: 2,
        desc: 'Specialized tables for cardiac examinations',
      },
    ],
    occupancy: { current: 2, total: 4 },
  },
  {
    room_number: 113,
    type: 'Neurology Clinic',
    equipment: [
      {
        type: 'EEG_machine',
        count: 1,
        desc: 'Device for recording electrical brain activity',
      },
      {
        type: 'transcranial_doppler',
        count: 1,
        desc: 'Ultrasound system for measuring cerebral blood flow',
      },
      {
        type: 'patient_exam_chair',
        count: 2,
        desc: 'Specialized chairs for neurological examinations',
      },
      {
        type: 'reflex_hammer',
        count: 2,
        desc: 'Tools for testing neurological reflexes',
      },
    ],
    occupancy: { current: 1, total: 2 },
  },
  {
    room_number: 114,
    type: 'Endoscopy Suite',
    equipment: [
      {
        type: 'endoscope',
        count: 4,
        desc: 'Flexible instruments for internal visualization',
      },
      {
        type: 'video_processor',
        count: 2,
        desc: 'Devices for recording and displaying endoscopic images',
      },
      {
        type: 'insufflator',
        count: 2,
        desc: 'Equipment for introducing gas into body cavities',
      },
      {
        type: 'patient_exam_table',
        count: 2,
        desc: 'Specialized tables for endoscopic procedures',
      },
    ],
    occupancy: { current: 2, total: 4 },
  },
  {
    room_number: 115,
    type: 'Dialysis Unit',
    equipment: [
      {
        type: 'dialysis_machine',
        count: 6,
        desc: 'Devices for filtering waste from the blood',
      },
      {
        type: 'patient_recliner',
        count: 6,
        desc: 'Chairs designed for patients undergoing dialysis',
      },
      {
        type: 'reverse_osmosis_system',
        count: 1,
        desc: 'Water purification system for dialysis',
      },
      {
        type: 'vital_sign_monitor',
        count: 6,
        desc: 'Devices for monitoring patient health during dialysis',
      },
    ],
    occupancy: { current: 5, total: 5 },
  },
  {
    room_number: 116,
    type: 'Burn Unit',
    equipment: [
      {
        type: 'specialized_burn_bed',
        count: 4,
        desc: 'Beds designed for burn patient care',
      },
      {
        type: 'wound_vac',
        count: 2,
        desc: 'Devices for negative pressure wound therapy',
      },
      {
        type: 'hydrotherapy_tub',
        count: 1,
        desc: 'Tub for cleansing and treating burn wounds',
      },
      {
        type: 'IV_infusion_pump',
        count: 4,
        desc: 'Devices for controlled delivery of fluids',
      },
    ],
    occupancy: { current: 3, total: 8 },
  },
  {
    room_number: 117,
    type: 'Physical Therapy Gym',
    equipment: [
      {
        type: 'parallel_bars',
        count: 1,
        desc: 'Supports for gait and balance training',
      },
      {
        type: 'weight_rack',
        count: 1,
        desc: 'Storage for resistance training equipment',
      },
      {
        type: 'exercise_balls',
        count: 10,
        desc: 'Therapeutic balls for core and stability exercises',
      },
      {
        type: 'treatment_table',
        count: 4,
        desc: 'Padded tables for manual therapy and assessment',
      },
    ],
    occupancy: { current: 4, total: 4 },
  },
  {
    room_number: 118,
    type: 'Occupational Therapy Workshop',
    equipment: [
      {
        type: 'woodworking_tools',
        count: 1,
        desc: 'Set of power tools for woodworking projects',
      },
      {
        type: 'sewing_machine',
        count: 2,
        desc: 'Devices for textile-based therapeutic activities',
      },
      {
        type: 'kitchen_appliances',
        count: 1,
        desc: 'Range, oven, and sink for cooking activities',
      },
      {
        type: 'adjustable_workbenches',
        count: 4,
        desc: 'Tables for task-oriented rehabilitation',
      },
    ],
    occupancy: { current: 2, total: 4 },
  },
  {
    room_number: 119,
    type: 'Speech Therapy Clinic',
    equipment: [
      {
        type: 'speech_therapy_materials',
        count: 1,
        desc: 'Assortment of communication aids and tools',
      },
      {
        type: 'video_recording_equipment',
        count: 1,
        desc: 'Cameras and microphones for therapeutic sessions',
      },
      {
        type: 'patient_seating',
        count: 4,
        desc: 'Chairs and tables for patient-clinician interaction',
      },
      {
        type: 'whiteboard',
        count: 1,
        desc: 'Surface for visual communication exercises',
      },
    ],
    occupancy: { current: 1, total: 2 },
  },
  {
    room_number: 120,
    type: 'Palliative Care Suite',
    equipment: [
      {
        type: 'hospital_bed',
        count: 1,
        desc: 'Adjustable bed for comfort and care',
      },
      {
        type: 'recliner',
        count: 1,
        desc: 'Chair for visitors and family members',
      },
      {
        type: 'oxygen_concentrator',
        count: 1,
        desc: 'Device for providing supplemental oxygen',
      },
      {
        type: 'medication_cart',
        count: 1,
        desc: 'Mobile storage for palliative medications',
      },
    ],
    occupancy: { current: 1, total: 1 },
  },
  {
    room_number: 121,
    type: 'Trauma Bay',
    equipment: [
      { type: 'gurney', count: 2, desc: 'Mobile beds for emergency care' },
      {
        type: 'ventilator',
        count: 1,
        desc: 'Mechanical ventilator for respiratory support',
      },
      {
        type: 'defibrillator',
        count: 1,
        desc: 'Device for restoring normal heart rhythm',
      },
      {
        type: 'ultrasound_machine',
        count: 1,
        desc: 'Portable imaging device for rapid assessment',
      },
    ],
    occupancy: { current: 1, total: 4 },
  },
  {
    room_number: 122,
    type: 'Radiation Oncology',
    equipment: [
      {
        type: 'linear_accelerator',
        count: 1,
        desc: 'Device for delivering targeted radiation therapy',
      },
      {
        type: 'CT_simulator',
        count: 1,
        desc: 'Imaging system for treatment planning',
      },
      {
        type: 'patient_positioning_system',
        count: 1,
        desc: 'Adjustable table and immobilization devices',
      },
      {
        type: 'treatment_planning_software',
        count: 1,
        desc: 'Computer system for dose calculation and optimization',
      },
    ],
    occupancy: { current: 1, total: 1 },
  },
  {
    room_number: 123,
    type: 'Infusion Clinic',
    equipment: [
      {
        type: 'infusion_chair',
        count: 6,
        desc: 'Comfortable chairs for patients receiving IV treatments',
      },
      {
        type: 'IV_pump',
        count: 6,
        desc: 'Devices for controlled delivery of intravenous medications',
      },
      {
        type: 'vital_sign_monitor',
        count: 2,
        desc: 'Equipment for monitoring patient health during infusion',
      },
      {
        type: 'medication_refrigerator',
        count: 1,
        desc: 'Unit for storing temperature-sensitive drugs',
      },
    ],
    occupancy: { current: 4, total: 4 },
  },
  {
    room_number: 124,
    type: 'Respiratory Therapy Clinic',
    equipment: [
      {
        type: 'spirometer',
        count: 2,
        desc: 'Devices for measuring lung function',
      },
      {
        type: 'nebulizer',
        count: 2,
        desc: 'Equipment for delivering aerosolized medications',
      },
      {
        type: 'CPAP_machine',
        count: 2,
        desc: 'Devices for continuous positive airway pressure therapy',
      },
      {
        type: 'oxygen_concentrator',
        count: 2,
        desc: 'Units for providing supplemental oxygen',
      },
    ],
    occupancy: { current: 2, total: 4 },
  },
  {
    room_number: 125,
    type: 'Wound Care Clinic',
    equipment: [
      {
        type: 'wound_vac',
        count: 2,
        desc: 'Devices for negative pressure wound therapy',
      },
      {
        type: 'dressing_supplies',
        count: 1,
        desc: 'Assortment of bandages, gauze, and other wound care materials',
      },
      {
        type: 'wound_imaging_camera',
        count: 1,
        desc: 'Device for capturing high-resolution wound images',
      },
      {
        type: 'patient_exam_table',
        count: 2,
        desc: 'Specialized tables for wound assessment and treatment',
      },
    ],
    occupancy: { current: 2, total: 2 },
  },
  {
    room_number: 126,
    type: 'Sleep Disorders Clinic',
    equipment: [
      {
        type: 'polysomnography_equipment',
        count: 2,
        desc: 'Devices for monitoring sleep stages and physiology',
      },
      {
        type: 'CPAP_machine',
        count: 2,
        desc: 'Units for delivering continuous positive airway pressure',
      },
      {
        type: 'patient_sleep_lab_bed',
        count: 2,
        desc: 'Beds designed for overnight sleep studies',
      },
      {
        type: 'video_recording_system',
        count: 1,
        desc: 'Cameras and software for monitoring sleep behaviors',
      },
    ],
    occupancy: { current: 1, total: 3 },
  },
  {
    room_number: 127,
    type: 'Bariatric Clinic',
    equipment: [
      {
        type: 'bariatric_hospital_bed',
        count: 2,
        desc: 'Reinforced beds for patients with higher body weights',
      },
      {
        type: 'bariatric_patient_lift',
        count: 1,
        desc: 'Device for safely transferring larger patients',
      },
      {
        type: 'bariatric_wheelchair',
        count: 1,
        desc: 'Wider and sturdier wheelchair for bariatric patients',
      },
      {
        type: 'body_composition_analyzer',
        count: 1,
        desc: 'Equipment for assessing body fat and muscle mass',
      },
    ],
    occupancy: { current: 1, total: 2 },
  },
  {
    room_number: 128,
    type: 'Psychiatry Clinic',
    equipment: [
      {
        type: 'therapy_couch',
        count: 2,
        desc: 'Comfortable furniture for psychotherapy sessions',
      },
      {
        type: 'therapy_chairs',
        count: 4,
        desc: 'Seating for clinicians and patients',
      },
      {
        type: 'biofeedback_equipment',
        count: 1,
        desc: 'Devices for monitoring and training physiological responses',
      },
      {
        type: 'video_conferencing_system',
        count: 1,
        desc: 'Setup for remote and telepsychiatry sessions',
      },
    ],
    occupancy: { current: 2, total: 2 },
  },
  {
    room_number: 129,
    type: 'Consultation Room',
    equipment: [
      {
        type: 'video_conferencing_system',
        count: 1,
        desc: 'Cameras, displays, and audio equipment for virtual visits',
      },
      {
        type: 'digital_stethoscope',
        count: 1,
        desc: 'Device for remote auscultation of heart and lung sounds',
      },
      {
        type: 'digital_otoscope',
        count: 1,
        desc: 'Camera-equipped tool for examining the ear',
      },
      {
        type: 'patient_exam_chair',
        count: 1,
        desc: 'Specialized chair for telehealth consultations',
      },
    ],
    occupancy: { current: 1, total: 2 },
  },
  {
    room_number: 130,
    type: 'Multipurpose Conference Room',
    equipment: [
      {
        type: 'conference_table',
        count: 1,
        desc: 'Large table for group meetings and presentations',
      },
      {
        type: 'conference_chairs',
        count: 10,
        desc: 'Comfortable seating for attendees',
      },
      {
        type: 'projector_and_screen',
        count: 1,
        desc: 'Equipment for displaying digital content',
      },
      {
        type: 'video_conferencing_system',
        count: 1,
        desc: 'Cameras and microphones for remote participation',
      },
    ],
    occupancy: { current: 6, total: 6 },
  },
  {
    room_number: 131,
    type: 'Intensive Care Unit',
    equipment: [
      { type: 'bed', count: 3, desc: 'ICU beds with advanced monitoring' },
      { type: 'ventilator', count: 3, desc: 'Mechanical ventilators' },
      {
        type: 'vital_sign_monitor',
        count: 3,
        desc: 'Advanced patient monitoring systems',
      },
      {
        type: 'infusion_pump',
        count: 4,
        desc: 'Devices for controlled delivery of IV medications',
      },
    ],
    occupancy: { current: 3, total: 4 },
  },
  {
    room_number: 132,
    type: 'Operating Room',
    equipment: [
      { type: 'surgical_table', count: 1, desc: 'Motorized operating table' },
      {
        type: 'anesthesia_machine',
        count: 1,
        desc: 'General anesthesia delivery system',
      },
      { type: 'surgical_lights', count: 6, desc: 'Overhead surgical lighting' },
      {
        type: 'electrosurgical_unit',
        count: 2,
        desc: 'Devices for cutting and coagulating tissue',
      },
    ],
    occupancy: { current: 2, total: 2 },
  },
  {
    room_number: 133,
    type: 'Emergency Room',
    equipment: [
      {
        type: 'gurney',
        count: 6,
        desc: 'Portable hospital beds for emergency care',
      },
      {
        type: 'defibrillator',
        count: 3,
        desc: 'Devices for restoring normal heart rhythm',
      },
      {
        type: 'oxygen_tank',
        count: 8,
        desc: 'Compressed oxygen for respiratory support',
      },
      {
        type: 'ultrasound_machine',
        count: 1,
        desc: 'Portable imaging device for rapid assessment',
      },
    ],
    occupancy: { current: 4, total: 4 },
  },
  {
    room_number: 134,
    type: 'Pediatric Ward',
    equipment: [
      { type: 'pediatric_bed', count: 8, desc: 'Beds designed for children' },
      { type: 'crib', count: 6, desc: 'Cribs for infants and toddlers' },
      {
        type: 'nebulizer',
        count: 3,
        desc: 'Devices for delivering aerosolized medication',
      },
      {
        type: 'play_area',
        count: 1,
        desc: 'Space with age-appropriate toys and activities',
      },
    ],
    occupancy: { current: 6, total: 8 },
  },
  {
    room_number: 135,
    type: 'Maternity Ward',
    equipment: [
      {
        type: 'birthing_bed',
        count: 6,
        desc: 'Specialized beds for labor and delivery',
      },
      {
        type: 'infant_warmer',
        count: 3,
        desc: 'Devices to maintain newborn body temperature',
      },
      {
        type: 'breast_pump',
        count: 3,
        desc: 'Electric devices for expressing breast milk',
      },
      {
        type: 'fetal_monitor',
        count: 2,
        desc: 'Equipment for continuous monitoring of the fetus',
      },
    ],
    occupancy: { current: 5, total: 5 },
  },
  {
    room_number: 136,
    type: 'Rehabilitation Gym',
    equipment: [
      {
        type: 'treadmill',
        count: 3,
        desc: 'Motorized walking surfaces for physical therapy',
      },
      {
        type: 'stationary_bike',
        count: 4,
        desc: 'Exercise bikes for lower-body rehabilitation',
      },
      {
        type: 'parallel_bars',
        count: 2,
        desc: 'Supports for gait and balance training',
      },
      {
        type: 'weight_rack',
        count: 1,
        desc: 'Storage for resistance training equipment',
      },
    ],
    occupancy: { current: 5, total: 6 },
  },
  {
    room_number: 137,
    type: 'Imaging Suite',
    equipment: [
      {
        type: 'CT_scanner',
        count: 2,
        desc: 'Computed tomography imaging devices',
      },
      {
        type: 'MRI_machine',
        count: 1,
        desc: 'Magnetic resonance imaging device',
      },
      {
        type: 'ultrasound_machine',
        count: 3,
        desc: 'Devices for diagnostic sonography',
      },
      {
        type: 'x_ray_machine',
        count: 2,
        desc: 'Equipment for radiographic imaging',
      },
    ],
    occupancy: { current: 0, total: 8 },
  },
  {
    room_number: 138,
    type: 'Laboratory',
    equipment: [
      {
        type: 'centrifuge',
        count: 3,
        desc: 'Devices for separating blood components',
      },
      {
        type: 'microscope',
        count: 6,
        desc: 'Instruments for analyzing cellular samples',
      },
      {
        type: 'incubator',
        count: 2,
        desc: 'Environments for culturing microorganisms',
      },
      {
        type: 'spectrophotometer',
        count: 1,
        desc: 'Device for quantitative analysis of samples',
      },
    ],
    occupancy: { current: 3, total: 4 },
  },
  {
    room_number: 139,
    type: 'Pharmacy',
    equipment: [
      {
        type: 'medication_storage_cabinet',
        count: 6,
        desc: 'Secure cabinets for drug storage',
      },
      {
        type: 'automated_dispensing_machine',
        count: 3,
        desc: 'Devices for preparing and dispensing medications',
      },
      {
        type: 'compounding_station',
        count: 2,
        desc: 'Areas for mixing and preparing custom medications',
      },
      {
        type: 'refrigerator',
        count: 2,
        desc: 'Units for storing temperature-sensitive drugs',
      },
    ],
    occupancy: { current: 3, total: 4 },
  },
  {
    room_number: 140,
    type: 'Dietary Kitchen',
    equipment: [
      {
        type: 'commercial_oven',
        count: 2,
        desc: 'High-capacity ovens for food preparation',
      },
      {
        type: 'industrial_mixer',
        count: 2,
        desc: 'Large-scale devices for mixing ingredients',
      },
      {
        type: 'refrigerator',
        count: 3,
        desc: 'Units for storing perishable food items',
      },
      {
        type: 'commercial_dishwasher',
        count: 1,
        desc: 'High-efficiency machine for cleaning dishes',
      },
    ],
    occupancy: { current: 0, total: 4 },
  },
  {
    room_number: 141,
    type: 'Cardiology Clinic',
    equipment: [
      {
        type: 'EKG_machine',
        count: 3,
        desc: 'Devices for recording electrical activity of the heart',
      },
      {
        type: 'echocardiogram_machine',
        count: 2,
        desc: 'Ultrasound systems for imaging the heart',
      },
      {
        type: 'cardiac_stress_test_equipment',
        count: 2,
        desc: 'Treadmills and monitoring devices for stress tests',
      },
      {
        type: 'patient_exam_table',
        count: 3,
        desc: 'Specialized tables for cardiac examinations',
      },
    ],
    occupancy: { current: 3, total: 4 },
  },
  {
    room_number: 142,
    type: 'Neurology Clinic',
    equipment: [
      {
        type: 'EEG_machine',
        count: 2,
        desc: 'Devices for recording electrical brain activity',
      },
      {
        type: 'transcranial_doppler',
        count: 2,
        desc: 'Ultrasound systems for measuring cerebral blood flow',
      },
      {
        type: 'patient_exam_chair',
        count: 3,
        desc: 'Specialized chairs for neurological examinations',
      },
      {
        type: 'neuronavigation_system',
        count: 1,
        desc: 'Equipment for guiding surgical interventions',
      },
    ],
    occupancy: { current: 2, total: 4 },
  },
  {
    room_number: 143,
    type: 'Endoscopy Suite',
    equipment: [
      {
        type: 'endoscope',
        count: 6,
        desc: 'Flexible instruments for internal visualization',
      },
      {
        type: 'video_processor',
        count: 3,
        desc: 'Devices for recording and displaying endoscopic images',
      },
      {
        type: 'insufflator',
        count: 3,
        desc: 'Equipment for introducing gas into body cavities',
      },
      {
        type: 'patient_exam_table',
        count: 3,
        desc: 'Specialized tables for endoscopic procedures',
      },
    ],
    occupancy: { current: 3, total: 4 },
  },
  {
    room_number: 144,
    type: 'Dialysis Unit',
    equipment: [
      {
        type: 'dialysis_machine',
        count: 8,
        desc: 'Devices for filtering waste from the blood',
      },
      {
        type: 'patient_recliner',
        count: 8,
        desc: 'Chairs designed for patients undergoing dialysis',
      },
      {
        type: 'reverse_osmosis_system',
        count: 2,
        desc: 'Water purification systems for dialysis',
      },
      {
        type: 'vital_sign_monitor',
        count: 8,
        desc: 'Devices for monitoring patient health during dialysis',
      },
    ],
    occupancy: { current: 0, total: 8 },
  },
  {
    room_number: 145,
    type: 'Burn Unit',
    equipment: [
      {
        type: 'specialized_burn_bed',
        count: 6,
        desc: 'Beds designed for burn patient care',
      },
      {
        type: 'wound_vac',
        count: 3,
        desc: 'Devices for negative pressure wound therapy',
      },
      {
        type: 'hydrotherapy_tub',
        count: 2,
        desc: 'Tubs for cleansing and treating burn wounds',
      },
      {
        type: 'IV_infusion_pump',
        count: 6,
        desc: 'Devices for controlled delivery of fluids',
      },
    ],
    occupancy: { current: 4, total: 4 },
  },
  {
    room_number: 146,
    type: 'Physical Therapy Gym',
    equipment: [
      {
        type: 'parallel_bars',
        count: 2,
        desc: 'Supports for gait and balance training',
      },
      {
        type: 'weight_rack',
        count: 2,
        desc: 'Storage for resistance training equipment',
      },
      {
        type: 'exercise_balls',
        count: 15,
        desc: 'Therapeutic balls for core and stability exercises',
      },
      {
        type: 'therapy_mats',
        count: 6,
        desc: 'Padded mats for floor-based exercises',
      },
    ],
    occupancy: { current: 6, total: 9 },
  },
  {
    room_number: 147,
    type: 'Occupational Therapy Workshop',
    equipment: [
      {
        type: 'woodworking_tools',
        count: 2,
        desc: 'Sets of power tools for woodworking projects',
      },
      {
        type: 'sewing_machine',
        count: 3,
        desc: 'Devices for textile-based therapeutic activities',
      },
      {
        type: 'kitchen_appliances',
        count: 2,
        desc: 'Range, oven, and sink for cooking activities',
      },
      {
        type: 'adjustable_workbenches',
        count: 6,
        desc: 'Tables for task-oriented rehabilitation',
      },
    ],
    occupancy: { current: 0, total: 4 },
  },
  {
    room_number: 148,
    type: 'Speech Therapy Clinic',
    equipment: [
      {
        type: 'speech_therapy_materials',
        count: 2,
        desc: 'Assortment of communication aids and tools',
      },
      {
        type: 'video_recording_equipment',
        count: 2,
        desc: 'Cameras and microphones for therapeutic sessions',
      },
      {
        type: 'patient_seating',
        count: 6,
        desc: 'Chairs and tables for patient-clinician interaction',
      },
      {
        type: 'interactive_whiteboard',
        count: 1,
        desc: 'Digital surface for visual communication exercises',
      },
    ],
    occupancy: { current: 2, total: 4 },
  },
  {
    room_number: 149,
    type: 'Palliative Care Suite',
    equipment: [
      {
        type: 'hospital_bed',
        count: 2,
        desc: 'Adjustable beds for comfort and care',
      },
      {
        type: 'recliner',
        count: 2,
        desc: 'Chairs for visitors and family members',
      },
      {
        type: 'oxygen_concentrator',
        count: 2,
        desc: 'Devices for providing supplemental oxygen',
      },
      {
        type: 'medication_cart',
        count: 2,
        desc: 'Mobile storage for palliative medications',
      },
    ],
    occupancy: { current: 2, total: 4 },
  },
  {
    room_number: 150,
    type: 'Trauma Bay',
    equipment: [
      { type: 'gurney', count: 3, desc: 'Mobile beds for emergency care' },
      {
        type: 'ventilator',
        count: 2,
        desc: 'Mechanical ventilators for respiratory support',
      },
      {
        type: 'defibrillator',
        count: 2,
        desc: 'Devices for restoring normal heart rhythm',
      },
      {
        type: 'portable_x_ray_machine',
        count: 1,
        desc: 'Imaging device for rapid assessment',
      },
    ],
    occupancy: { current: 0, total: 4 },
  },
  {
    room_number: 152,
    type: 'Trauma Bay',
    equipment: [
      { type: 'gurney', count: 3, desc: 'Mobile beds for emergency care' },
      {
        type: 'ventilator',
        count: 2,
        desc: 'Mechanical ventilators for respiratory support',
      },
      {
        type: 'defibrillator',
        count: 2,
        desc: 'Devices for restoring normal heart rhythm',
      },
      {
        type: 'portable_x_ray_machine',
        count: 1,
        desc: 'Imaging device for rapid assessment',
      },
    ],
    occupancy: { current: 0, total: 4 },
  },
  {
    room_number: 152,
    type: 'Trauma Bay',
    equipment: [
      { type: 'gurney', count: 3, desc: 'Mobile beds for emergency care' },
      {
        type: 'ventilator',
        count: 2,
        desc: 'Mechanical ventilators for respiratory support',
      },
      {
        type: 'defibrillator',
        count: 2,
        desc: 'Devices for restoring normal heart rhythm',
      },
      {
        type: 'portable_x_ray_machine',
        count: 1,
        desc: 'Imaging device for rapid assessment',
      },
    ],
    occupancy: { current: 4, total: 4 },
  },
  {
    room_number: 200,
    type: 'Patient Room',
    equipment: [
      {
        type: 'bed',
        count: 3,
        desc: 'Bed for patients during their stay',
      },
      {
        type: 'ventilator',
        count: 2,
        desc: 'Mechanical ventilators for respiratory support',
      },
      {
        type: 'defibrillator',
        count: 2,
        desc: 'Devices for restoring normal heart rhythm',
      },
      {
        type: 'portable_x_ray_machine',
        count: 1,
        desc: 'Imaging device for rapid assessment',
      },
    ],
    occupancy: { current: 0, total: 4 },
  },
];

export type StaffType =
  | 'Surgeon'
  | 'Anesthesiologist'
  | 'Nurse'
  | 'Surgical Technician'
  | 'Oncologist'
  | 'Radiologist'
  | 'Radiation Therapist'
  | 'Interventional Radiologist'
  | 'Radiologic Technologist'
  | 'Gastroenterologist'
  | 'Cardiologist'
  | 'Sonographer'
  | 'Phlebotomist'
  | 'Physician';

export const stageTypes = [
  'diagnostic',
  'pre-operative',
  'peri-operative',
  'post-operative',
  'misc',
] as const;

export const nodeColors = {
  diagnostic: '#bad7f2',
  'pre-operative': '#fae588',
  'peri-operative': '#baf2bb',
  'post-operative': '#ffb7c3',
  misc: '#f2d7b7',
  pathway: '#cdc1ff',
  default: '#fff',
};

export type StageType = (typeof stageTypes)[number];

export const outputTypes = ['Scheduled', 'Next Available', 'Delay'] as const;

export type OutputType = (typeof outputTypes)[number];

export interface StageTemplate {
  id: string;
  name: string;
  desc: string;
  type: StageType;
  required_staff: string[];
  required_room: string;
  required_equipment: Equipment[];
  outputs: OutputType[];
  durationEstimate: number;
}
export interface PathwayStage {
  id: string;
  template: string;
  next: NextType[];
}

export type NextType = {
  [K in OutputType]?: string;
};

export interface RunningStage extends PathwayStage {
  assigned_staff: string[];
  assigned_room: string;
  date: Date;
  completed: boolean;
  progress: number;
}

export interface PathwayTemplate {
  id: string;
  title: string;
  desc: string;
  stages: PathwayStage[];
}

export interface RunningPathway extends PathwayTemplate {
  patient: string;
  startDate: Date;
  notes: string;
  stages: RunningStage[];
}

export const stageTemplates: StageTemplate[] = [
  {
    id: 'ca2009a2-153c-4463-8d26-8f5ab10f4dbf',
    name: 'Pre-Operation Assessment',
    desc: 'Pre-operative assessment',
    type: 'pre-operative',
    required_staff: ['Physician'],
    required_room: 'Consultation Room',
    required_equipment: [],
    outputs: ['Next Available'],
    durationEstimate: 120,
  },
  {
    id: '604af59f-14e0-422b-a9d7-3c27b51d8430',
    name: 'Surgical Decision',
    desc: 'Decision point: Choose the type of appendectomy.',
    type: 'peri-operative',
    required_staff: ['Surgeon', 'Nurse'],
    required_room: 'Operating Room',
    required_equipment: [],
    outputs: ['Scheduled', 'Scheduled'],
    durationEstimate: 60,
  },
  {
    id: '8f5548b0-d8e0-4858-8f42-fafec12c8038',
    name: 'Open Appendectomy',
    desc: 'Surgical procedure for open appendectomy.',
    type: 'peri-operative',
    required_staff: ['Surgeon', 'Nurse', 'Surgical Technician'],
    required_room: 'Operating Room',
    required_equipment: [
      {
        type: 'Surgical Instruments',
        count: 1,
        desc: 'Set of surgical instruments',
      },
    ],
    outputs: ['Scheduled'],
    durationEstimate: 240,
  },
  {
    id: '940c55da-54f0-49ee-88e9-278c7e1c09c8',
    name: 'Laparoscopic Appendectomy',
    desc: 'Surgical procedure for laparoscopic appendectomy.',
    type: 'peri-operative',
    required_staff: ['Surgeon', 'Nurse', 'Surgical Technician'],
    required_room: 'Operating Room',
    required_equipment: [
      {
        type: 'Laparoscopic Equipment',
        count: 1,
        desc: 'Laparoscopic tower',
      },
    ],
    outputs: ['Scheduled'],
    durationEstimate: 180,
  },
  {
    id: 'e476b23a-5c25-45f8-8256-921c608129dc',
    name: 'Post-Op Recovery',
    desc: 'Post-operative recovery and monitoring.',
    type: 'post-operative',
    required_staff: ['Nurse'],
    required_room: 'Recovery Room',
    required_equipment: [],
    outputs: ['Scheduled'],
    durationEstimate: 120,
  },
  {
    id: '4c670c41-1918-4943-b94f-8baebbd07aee',
    name: 'Patient Evaluation',
    desc: 'Patient evaluation and diagnosis.',
    type: 'pre-operative',
    required_staff: ['Oncologist', 'Radiologist', 'Nurse'],
    required_room: 'Consultation Room',
    required_equipment: [],
    outputs: ['Next Available'],
    durationEstimate: 15,
  },
  {
    id: '06b492c2-e439-4d50-8a85-008409ff6d46',
    name: 'Treatment Decision',
    desc: 'Decision point: Choose the treatment option for the patient.',
    type: 'peri-operative',
    required_staff: ['Oncologist', 'Nurse'],
    required_room: 'Meeting Room',
    required_equipment: [],
    outputs: ['Scheduled', 'Scheduled', 'Scheduled'],
    durationEstimate: 30,
  },
  {
    id: 'ccdfcf5f-2257-4f98-a595-621c19ee7fdf',
    name: 'Chemotherapy',
    desc: 'Chemotherapy treatment.',
    type: 'peri-operative',
    required_staff: ['Oncologist', 'Nurse'],
    required_room: 'Treatment Room',
    required_equipment: [
      { type: 'Chemotherapy Drugs', count: 1, desc: 'Chemotherapy drugs' },
    ],
    outputs: ['Scheduled'],
    durationEstimate: 120,
  },
  {
    id: 'a5e830d2-d7dd-4f82-af26-7d6ed69613e6',
    name: 'Radiation Therapy',
    desc: 'Radiation therapy treatment.',
    type: 'peri-operative',
    required_staff: ['Radiation Therapist', 'Nurse'],
    required_room: 'Radiation Room',
    required_equipment: [
      { type: 'Radiation Machine', count: 1, desc: 'Linear accelerator' },
    ],
    outputs: ['Scheduled'],
    durationEstimate: 60,
  },
  {
    id: '9029ef16-efc8-43a2-b23a-2ca30d49242b',
    name: 'Surgery',
    desc: 'Surgical procedure.',
    type: 'peri-operative',
    required_staff: ['Surgeon', 'Nurse'],
    required_room: 'Operating Room',
    required_equipment: [
      {
        type: 'Surgical Instruments',
        count: 1,
        desc: 'Set of surgical instruments',
      },
    ],
    outputs: ['Scheduled'],
    durationEstimate: 120,
  },
  {
    id: '87173152-fe28-4da8-8f70-892c3a511810',
    name: 'Post Treatment Monitoring',
    desc: 'Post-treatment monitoring and follow-up care.',
    type: 'post-operative',
    required_staff: ['Oncologist', 'Nurse'],
    required_room: 'Consultation Room',
    required_equipment: [],
    outputs: [],
    durationEstimate: 30,
  },
  {
    id: '63e9c520-c5a6-4c26-9232-b00514f419f6',
    name: 'Consultation',
    desc: 'Pre-operation meeting with patient',
    type: 'pre-operative',
    required_staff: ['Nurse'],
    required_room: 'Patient Room',
    required_equipment: [],
    outputs: ['Next Available'],
    durationEstimate: 30,
  },
  {
    id: '1e914995-58e4-4ad0-b20c-1ffdd4ebfba5',
    name: 'Mammogram',
    desc: 'X-Ray of Breast Area',
    type: 'diagnostic',
    required_staff: ['Interventional Radiologist', 'Nurse'],
    required_room: 'X-Ray Room',
    required_equipment: [],
    outputs: ['Next Available'],
    durationEstimate: 15,
  },
  {
    id: 'a7b66bd8-b0f2-4c9b-bd11-705ca38d5587',
    name: 'Stereotactic Biopsy',
    desc: 'Removal of breast tissue for analysis',
    type: 'peri-operative',
    required_staff: ['Surgeon', 'Nurse'],
    required_room: 'Surgery Room',
    required_equipment: [
      {
        type: 'Surgical Instruments',
        count: 1,
        desc: 'Set of surgical instruments',
      },
      {
        type: 'FNA Biopsy Needle',
        count: 1,
        desc: 'Extremely thin needle for small fluid or tissue extraction',
      },
      {
        type: 'Breast 3D Image',
        count: 1,
        desc: '3D Image of breast from mammogram to assist surgeons',
      },
    ],
    outputs: ['Scheduled'],
    durationEstimate: 60,
  },
  {
    id: 'b2f17959-df79-4c47-8d9a-8763ecea367a',
    name: 'Post Operation',
    desc: 'Post-operation meeting with patient',
    type: 'post-operative',
    required_staff: ['Nurse'],
    required_room: 'Recovery Room',
    required_equipment: [],
    outputs: ['Scheduled'],
    durationEstimate: 30,
  },
  {
    id: 'fc228731-d3ae-4632-bbb8-9ba52fcf750b',
    name: 'Results Meeting',
    desc: 'Meeting with patient after recieving test results from the lab',
    type: 'post-operative',
    required_staff: ['Nurse'],
    required_room: 'Recovery Room',
    required_equipment: [],
    outputs: [],
    durationEstimate: 30,
  },
  {
    id: '0c4b2961-b310-4537-8854-b2e8b24b8136',
    name: 'Physical Examination',
    desc: 'Physical Examination.',
    type: 'pre-operative',
    required_staff: ['Nurse'],
    required_room: 'Patient Room',
    required_equipment: [],
    outputs: ['Next Available'],
    durationEstimate: 30,
  },
  {
    id: '085dbd09-31e9-481e-9ebc-18b7490fac02',
    name: 'Angiogram',
    desc: 'X-Ray using contrast dye.',
    type: 'diagnostic',
    required_staff: ['Interventional Radiologist', 'Nurse'],
    required_room: 'Cath Lab',
    required_equipment: [
      {
        type: 'Contrast dye',
        count: 1,
        desc: 'Contrast dye',
      },
    ],
    outputs: ['Next Available'],
    durationEstimate: 30,
  },
  {
    id: '20d1ae9f-f1c8-4835-9fff-1cc96ba3bb27',
    name: 'MRI Scan',
    desc: 'Magnetic Resonance Imaging',
    type: 'diagnostic',
    required_staff: ['Radiologic Technologist'],
    required_room: 'MRI Suite',
    required_equipment: [
      {
        type: 'MRI Machine',
        count: 1,
        desc: 'Magnetic Resonance Imaging Machine',
      },
    ],
    outputs: ['Next Available'],
    durationEstimate: 30,
  },
  {
    id: '6bb4d7d1-a1ed-4309-b921-4a811675869b',
    name: 'Colonoscopy',
    desc: 'Endoscopic examination of the large bowel and the distal part of the small bowel.',
    type: 'diagnostic',
    required_staff: ['Gastroenterologist', 'Nurse'],
    required_room: 'Endoscopy Suite',
    required_equipment: [
      {
        type: 'Colonoscope',
        count: 1,
        desc: 'Flexible tube with a camera for examining the colon.',
      },
    ],
    outputs: ['Next Available'],
    durationEstimate: 30,
  },
  {
    id: '936f696f-b36e-48b6-94d3-b753994fe62e',
    name: 'Electrocardiogram ',
    desc: 'Recording of the electrical activity of the heart over a period of time.',
    type: 'diagnostic',
    required_staff: ['Cardiologist', 'Nurse'],
    required_room: 'Cardiology Clinic',
    required_equipment: [
      {
        type: 'ECG Machine',
        count: 1,
        desc: 'Device for recording heart activity.',
      },
    ],
    outputs: ['Next Available'],
    durationEstimate: 30,
  },
  {
    id: '928f24ce-bf7b-4527-b558-760833ae2f39',
    name: 'Ultrasound',
    desc: 'Medical imaging technique that uses high-frequency sound waves to visualize internal body structures.',
    type: 'diagnostic',
    required_staff: ['Radiologist', 'Sonographer'],
    required_room: 'Ultrasound Room',
    required_equipment: [
      {
        type: 'Ultrasound Machine',
        count: 1,
        desc: 'Device for performing ultrasound scans.',
      },
    ],
    outputs: ['Next Available'],
    durationEstimate: 30,
  },
  {
    id: 'c931c66e-9fc8-40c3-bca2-07b1aafcc756',
    name: 'BloodTest',
    desc: 'Laboratory analysis of blood sample for various purposes.',
    type: 'diagnostic',
    required_staff: ['Phlebotomist'],
    required_room: 'Phlebotomy Room',
    required_equipment: [
      {
        type: 'Blood Collection Kit',
        count: 1,
        desc: 'Equipment for drawing blood samples.',
      },
    ],
    outputs: ['Next Available'],
    durationEstimate: 15,
  },
  {
    id: '93efab91-1d1b-4a79-823e-5aff43881db8',
    name: 'Consultation',
    desc: 'Post-operation or Screening meeting with patient',
    type: 'post-operative',
    required_staff: ['Nurse'],
    required_room: 'Patient Room',
    required_equipment: [],
    outputs: [],
    durationEstimate: 15,
  },
];

export const procedures: PathwayTemplate[] = [
  {
    id: '3c34f343-2881-4f1b-ae00-0afc9e02b30c',
    title: 'Appendectomy',
    desc: 'Surgical removal of the appendix.',
    stages: [
      {
        id: 'bbab5f0c-8ed3-42ab-a079-fcca8ec4e703',
        template: 'ca2009a2-153c-4463-8d26-8f5ab10f4dbf',
        next: [{ 'Next Available': 'e3206412-66f6-4806-8316-bc72ad1ac0a4' }],
      },
      {
        id: 'e3206412-66f6-4806-8316-bc72ad1ac0a4',
        template: '604af59f-14e0-422b-a9d7-3c27b51d8430',
        next: [
          { Scheduled: '5c877e3f-7d01-446e-b159-eddc3c73f658' },
          { Scheduled: 'b9c098da-a6b4-4784-b751-8c768faacc7e' },
        ],
      },
      {
        id: '5c877e3f-7d01-446e-b159-eddc3c73f658',
        template: '8f5548b0-d8e0-4858-8f42-fafec12c8038',
        next: [{ Scheduled: '6b3839ae-bbf5-4b7c-9569-b7ea646338ea' }],
      },
      {
        id: 'b9c098da-a6b4-4784-b751-8c768faacc7e',
        template: '940c55da-54f0-49ee-88e9-278c7e1c09c8',
        next: [{ Scheduled: '6b3839ae-bbf5-4b7c-9569-b7ea646338ea' }],
      },
      {
        id: '6b3839ae-bbf5-4b7c-9569-b7ea646338ea',
        template: 'e476b23a-5c25-45f8-8256-921c608129dc',
        next: [],
      },
    ],
  },
  {
    id: '3ecc9f37-6c96-4934-8e95-723d95e7f9d7',
    title: 'Treatment Decision for Cancer Patients',
    desc: 'Decision-making process for the treatment of cancer patients.',
    stages: [
      {
        id: 'f7662147-a81b-403b-8c1a-245bd74a9aef',
        template: '4c670c41-1918-4943-b94f-8baebbd07aee',
        next: [{ 'Next Available': '4db67a9b-1d56-4b54-8f09-e33c7b2a535a' }],
      },
      {
        id: '4db67a9b-1d56-4b54-8f09-e33c7b2a535a',
        template: '06b492c2-e439-4d50-8a85-008409ff6d46',
        next: [
          { Scheduled: '3dd65179-0989-40aa-85d5-f937f3dab4a2' },
          { Scheduled: '19bb7dee-496c-4437-b4f7-46445913c1d8' },
          { Scheduled: '4f2d1e9d-4bce-41e5-a565-2c7e29bc3e99' },
        ],
      },
      {
        id: '3dd65179-0989-40aa-85d5-f937f3dab4a2',
        template: 'ccdfcf5f-2257-4f98-a595-621c19ee7fdf',
        next: [{ 'Next Available': 'efa4cad2-c2e1-47f4-ba07-82c5c1d65c03' }],
      },
      {
        id: '19bb7dee-496c-4437-b4f7-46445913c1d8',
        template: 'a5e830d2-d7dd-4f82-af26-7d6ed69613e6',
        next: [{ 'Next Available': 'efa4cad2-c2e1-47f4-ba07-82c5c1d65c03' }],
      },
      {
        id: '4f2d1e9d-4bce-41e5-a565-2c7e29bc3e99',
        template: '9029ef16-efc8-43a2-b23a-2ca30d49242b',
        next: [{ 'Next Available': 'efa4cad2-c2e1-47f4-ba07-82c5c1d65c03' }],
      },
      {
        id: 'efa4cad2-c2e1-47f4-ba07-82c5c1d65c03',
        template: '87173152-fe28-4da8-8f70-892c3a511810',
        next: [],
      },
    ],
  },
  {
    id: 'd213a950-0965-41d3-8ff7-39154a9623ac',
    title: 'ElderlyCheckup',
    desc: 'Testing for common ailments of elderly patient',
    stages: [
      {
        id: 'a6ee30bf-d4c8-4501-8a6b-9359f0eaadad',
        template: '0c4b2961-b310-4537-8854-b2e8b24b8136',
        next: [{ Scheduled: '657b5f1d-12fa-4b2f-9ea1-05732a444e06' }],
      },
      {
        id: '657b5f1d-12fa-4b2f-9ea1-05732a444e06',
        template: '085dbd09-31e9-481e-9ebc-18b7490fac02',
        next: [{ Scheduled: '8c23c5f3-c3aa-4922-bfdf-ca11840b73cf' }],
      },
      {
        id: '8c23c5f3-c3aa-4922-bfdf-ca11840b73cf',
        template: '20d1ae9f-f1c8-4835-9fff-1cc96ba3bb27',
        next: [{ Scheduled: '14a254fe-8ee7-4e87-81dc-8bce03ccd51e' }],
      },
      {
        id: '14a254fe-8ee7-4e87-81dc-8bce03ccd51e',
        template: '6bb4d7d1-a1ed-4309-b921-4a811675869b',
        next: [{ Scheduled: 'add5ea8f-6f4e-486e-99ed-a68d6e2ff3fa' }],
      },
      {
        id: 'add5ea8f-6f4e-486e-99ed-a68d6e2ff3fa',
        template: '936f696f-b36e-48b6-94d3-b753994fe62e',
        next: [{ Scheduled: 'ff9f3958-321c-440f-b3f3-f115b0adf6be' }],
      },
      {
        id: 'ff9f3958-321c-440f-b3f3-f115b0adf6be',
        template: '928f24ce-bf7b-4527-b558-760833ae2f39',
        next: [{ Scheduled: '58d08a98-b9da-495d-86e3-4686b6e400cf' }],
      },
      {
        id: '58d08a98-b9da-495d-86e3-4686b6e400cf',
        template: 'c931c66e-9fc8-40c3-bca2-07b1aafcc756',
        next: [{ Scheduled: '933d9ba7-b53c-4630-95ae-d35f235002d3' }],
      },
      {
        id: '933d9ba7-b53c-4630-95ae-d35f235002d3',
        template: '93efab91-1d1b-4a79-823e-5aff43881db8',
        next: [],
      },
    ],
  },
  {
    id: 'vwq236fy-2881-40v0-40v0-73y4byy41udl',
    title: 'Breast Biopsy',
    desc: 'Removal of breast tissue for analysis',
    stages: [
      {
        id: '6c4d716a-4f8c-4a1d-b4a5-2304ab8f809d',
        template: '63e9c520-c5a6-4c26-9232-b00514f419f6',
        next: [{ Scheduled: '707c82bb-d726-45de-a2ea-73a5bafd3cdd' }],
      },
      {
        id: '707c82bb-d726-45de-a2ea-73a5bafd3cdd',
        template: '1e914995-58e4-4ad0-b20c-1ffdd4ebfba5',
        next: [{ Scheduled: 'de204be1-5bd4-4cee-8a9b-95534973a38f' }],
      },
      {
        id: 'de204be1-5bd4-4cee-8a9b-95534973a38f',
        template: 'a7b66bd8-b0f2-4c9b-bd11-705ca38d5587',
        next: [{ Scheduled: 'c00fd6d8-7795-4c9c-94ba-9cf82d479930' }],
      },
      {
        id: 'c00fd6d8-7795-4c9c-94ba-9cf82d479930',
        template: 'b2f17959-df79-4c47-8d9a-8763ecea367a',
        next: [{ Scheduled: '1def706e-91c7-4ae7-9bec-ef8b212c90a3' }],
      },
      {
        id: '1def706e-91c7-4ae7-9bec-ef8b212c90a3',
        template: 'fc228731-d3ae-4632-bbb8-9ba52fcf750b',
        next: [],
      },
    ],
  },
];

export const runningPathways: RunningPathway[] = [
  {
    id: '3c34f343-2881-4f1b-ae00-0afc9e02b30c',
    title: 'Appendectomy',
    desc: 'Surgical removal of the appendix.',
    patient: 'John Smith',
    notes: 'Patient has a history of appendicitis.',
    startDate: new Date('2024-04-01T08:00:00'),
    stages: [
      {
        id: 'bbab5f0c-8ed3-42ab-a079-fcca8ec4e703',
        template: 'ca2009a2-153c-4463-8d26-8f5ab10f4dbf',
        next: [{ Scheduled: 'e3206412-66f6-4806-8316-bc72ad1ac0a4' }],
        assigned_staff: ['Dr. Johnson'],
        assigned_room: 'Room 103',
        date: new Date('2024-04-01T10:00:00'),
        completed: true,
        progress: 0,
      },
      {
        id: 'e3206412-66f6-4806-8316-bc72ad1ac0a4',
        template: '604af59f-14e0-422b-a9d7-3c27b51d8430',
        next: [
          { Scheduled: '5c877e3f-7d01-446e-b159-eddc3c73f658' },
          { Scheduled: 'b9c098da-a6b4-4784-b751-8c768faacc7e' },
        ],
        assigned_staff: ['Dr. Johnson'],
        assigned_room: 'Room 103',
        date: new Date('2024-04-01T15:00:00'),
        completed: true,
        progress: 0,
      },
      {
        id: '5c877e3f-7d01-446e-b159-eddc3c73f658',
        template: '8f5548b0-d8e0-4858-8f42-fafec12c8038',
        next: [{ Scheduled: '6b3839ae-bbf5-4b7c-9569-b7ea646338ea' }],
        assigned_staff: ['Dr. Johnson'],
        assigned_room: 'Room 103',
        date: new Date('2024-04-03T11:00:00'),
        completed: false,
        progress: 0,
      },
      {
        id: 'b9c098da-a6b4-4784-b751-8c768faacc7e',
        template: '940c55da-54f0-49ee-88e9-278c7e1c09c8',
        next: [{ Scheduled: '6b3839ae-bbf5-4b7c-9569-b7ea646338ea' }],
        assigned_staff: ['Dr. Johnson'],
        assigned_room: 'Room 103',
        date: new Date('2024-04-03T08:00:00'),
        completed: false,
        progress: 0,
      },
      {
        id: '6b3839ae-bbf5-4b7c-9569-b7ea646338ea',
        template: 'e476b23a-5c25-45f8-8256-921c608129dc',
        next: [],
        assigned_staff: ['Dr. Johnson'],
        assigned_room: 'Room 103',
        date: new Date('2024-04-03T15:00:00'),
        completed: false,
        progress: 0,
      },
    ],
  },
];

export type Conflict = {
  pathway: string;
  time: string;
};
