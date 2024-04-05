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
];

export type Equipment = {
  type: string;
  count: number;
  desc: string;
};

export type HospitalRoom = {
  room_number: number;
  type: string;
  equipment: Equipment[];
  occupied: number;
};

export const displayedRooms: HospitalRoom[] = [
  {
    room_number: 101,
    type: 'Standard',
    equipment: [
      {
        type: 'bed',
        count: 4,
        desc: 'Standard hospital beds',
      },
      {
        type: 'IV pump',
        count: 2,
        desc: 'Infusion pumps for intravenous fluids',
      },
    ],
    occupied: 0,
  },
  {
    room_number: 102,
    type: 'Intensive Care Unit',
    equipment: [
      {
        type: 'bed',
        count: 3,
        desc: 'Electric adjustable beds',
      },
      {
        type: 'ventilator',
        count: 1,
        desc: 'Respiratory support machine',
      },
    ],
    occupied: 2,
  },
  {
    room_number: 103,
    type: 'Operating Room',
    equipment: [
      {
        type: 'bed',
        count: 2,
        desc: 'Pediatric beds with side rails',
      },
      {
        type: 'X-ray machine',
        count: 1,
        desc: 'Radiographic imaging device',
      },
    ],
    occupied: 2,
  },
  {
    room_number: 201,
    type: 'Critical Care Unit',
    equipment: [
      {
        type: 'bed',
        count: 5,
        desc: 'Intensive care unit (ICU) beds',
      },
      {
        type: 'monitor',
        count: 3,
        desc: 'Patient vital sign monitors',
      },
      {
        type: 'defibrillator',
        count: 1,
        desc: 'Emergency heart rhythm management device',
      },
    ],
    occupied: 2,
  },
  {
    room_number: 202,
    type: 'Bariatric Care',
    equipment: [
      {
        type: 'bed',
        count: 2,
        desc: 'Bariatric beds for obese patients',
      },
      {
        type: 'dialysis machine',
        count: 1,
        desc: 'Machine for kidney dialysis treatment',
      },
    ],
    occupied: 2,
  },
  {
    room_number: 203,
    type: 'Maternity Ward',
    equipment: [
      {
        type: 'bed',
        count: 4,
        desc: 'Maternity beds with birthing stools',
      },
      {
        type: 'fetal monitor',
        count: 2,
        desc: 'Monitoring devices for fetal heart rate',
      },
      {
        type: 'ultrasound machine',
        count: 1,
        desc: 'Imaging equipment for obstetric ultrasound',
      },
    ],
    occupied: 0,
  },
  {
    room_number: 204,
    type: 'Pediatric Ward',
    equipment: [
      {
        type: 'bed',
        count: 3,
        desc: 'Recovery beds for post-surgical patients',
      },
      {
        type: 'EKG machine',
        count: 1,
        desc: 'Electrocardiogram machine for heart monitoring',
      },
    ],
    occupied: 0,
  },
];

export type StaffType =
  | 'Surgeon'
  | 'Anesthesiologist'
  | 'Nurse'
  | 'Surgical Technician'
  | 'Oncologist'
  | 'Radiologist'
  | 'Radiation Therapist';

export type StageType = 'pre-operative' | 'peri-operative' | 'post-operative';

export type Stage = {
  name: string;
  desc: string;
  type: StageType;
  required_staff: StaffType[];
  required_room: string;
  required_equipment: Equipment[];
  date: string;
  time: string;
  duration: number;
  next: string | string[] | null;
  start: boolean;
};

export type Procedure = {
  title: string;
  desc: string;
  patient: string;
  stages: Stage[];
};

export const procedures: Procedure[] = [
  {
    title: 'Appendectomy',
    desc: 'Surgical removal of the appendix.',
    patient: 'Michael Johnson',
    stages: [
      {
        name: 'PreOpAssessment',
        desc: 'Pre-operative assessment',
        type: 'pre-operative',
        required_staff: ['Surgeon', 'Anesthesiologist', 'Nurse'],
        required_room: 'Pre-Op Room',
        required_equipment: [],
        date: '2024-04-20',
        time: '08:00',
        duration: 120,
        next: 'SurgicalDecision',
        start: true,
      },
      {
        name: 'SurgicalDecision',
        desc: 'Decision point: Choose the type of appendectomy.',
        type: 'peri-operative',
        required_staff: ['Surgeon', 'Nurse'],
        required_room: 'Operating Room',
        required_equipment: [],
        date: '2024-04-21',
        time: '09:00',
        duration: 60,
        next: ['OpenAppendectomy', 'LaparoscopicAppendectomy'],
        start: false,
      },
      {
        name: 'OpenAppendectomy',
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
        duration: 240,
        time: '10:00',
        date: '2024-04-30',
        next: 'PostOpRecovery',
        start: false,
      },
      {
        name: 'LaparoscopicAppendectomy',
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
        duration: 200,
        date: '2024-05-01',
        time: '12:00',
        next: 'PostOpRecovery',
        start: false,
      },
      {
        name: 'PostOpRecovery',
        desc: 'Post-operative recovery and monitoring.',
        type: 'post-operative',
        required_staff: ['Nurse'],
        required_room: 'Recovery Room',
        required_equipment: [],
        date: '2024-05-01',
        time: '03:00',
        duration: 1200,
        next: null,
        start: false,
      },
    ],
  },
  {
    title: 'Treatment Decision for Cancer Patients',
    desc: 'Decision-making process for the treatment of cancer patients.',
    patient: 'Sarah Williams',
    stages: [
      {
        name: 'PatientEvaluation',
        desc: 'Patient evaluation and diagnosis.',
        type: 'pre-operative',
        required_staff: ['Oncologist', 'Radiologist', 'Nurse'],
        required_room: 'Consultation Room',
        required_equipment: [],
        date: '2024-03-30',
        time: '08:00',
        next: 'TreatmentDecision',
        duration: 60,
        start: true,
      },
      {
        name: 'TreatmentDecision',
        desc: 'Decision point: Choose the treatment option for the patient.',
        type: 'peri-operative',
        required_staff: ['Oncologist', 'Nurse'],
        required_room: 'Meeting Room',
        required_equipment: [],
        date: '2024-03-30',
        time: '14:00',
        duration: 60,
        next: ['Chemotherapy', 'RadiationTherapy', 'Surgery'],
        start: false,
      },
      {
        name: 'Chemotherapy',
        desc: 'Chemotherapy treatment.',
        type: 'peri-operative',
        required_staff: ['Oncologist', 'Nurse'],
        required_room: 'Treatment Room',
        required_equipment: [
          { type: 'Chemotherapy Drugs', count: 1, desc: 'Chemotherapy drugs' },
        ],
        date: '2024-03-31',
        time: '10:00',
        duration: 60,
        next: 'PostTreatmentMonitoring',
        start: false,
      },
      {
        name: 'RadiationTherapy',
        desc: 'Radiation therapy treatment.',
        type: 'peri-operative',
        required_staff: ['Radiation Therapist', 'Nurse'],
        required_room: 'Radiation Room',
        required_equipment: [
          { type: 'Radiation Machine', count: 1, desc: 'Linear accelerator' },
        ],
        date: '2024-03-31',
        time: '12:00',
        duration: 60,
        next: 'PostTreatmentMonitoring',
        start: false,
      },
      {
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
        date: '2024-03-31',
        time: '14:00',
        duration: 60,
        next: 'PostTreatmentMonitoring',
        start: false,
      },
      {
        name: 'PostTreatmentMonitoring',
        desc: 'Post-treatment monitoring and follow-up care.',
        type: 'post-operative',
        required_staff: ['Oncologist', 'Nurse'],
        required_room: 'Consultation Room',
        required_equipment: [],
        date: '2024-04-01',
        time: '09:00',
        duration: 60,
        next: null,
        start: false,
      },
    ],
  },
];

export const stages = procedures.flatMap((procedure) => procedure.stages);
