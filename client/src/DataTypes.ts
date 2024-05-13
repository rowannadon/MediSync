export type Person = {
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  admin: boolean;
  location: string;
  username: string;
};

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
  next: string;
  type: OutputType;
  value?: string;
};

export interface Assignments {
  [key: number]: string[];
}

export interface RunningStage {
  id: string;
  template: StageTemplate;
  assigned_staff: { id?: string; type?: string }[];
  assigned_room: string;
  date: Date;
  timeOffset: number;
  completed: boolean;
  runnable: boolean;
  next: NextType[];
  delay: number;
  scheduleOffset: number;
}

export interface PathwayTemplate {
  id: string;
  title: string;
  desc: string;
  stages: PathwayStage[];
}

export interface RunningPathway {
  id: string;
  title: string;
  desc: string;
  patient: string;
  startDate: Date;
  notes: string;
  stages: RunningStage[];
}

export type Conflict = {
  pathway: string;
  time: string;
};
