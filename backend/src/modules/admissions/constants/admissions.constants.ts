/**
 * Permission keys for the admissions pipeline, matching what the Roles & Permissions page shows for
 * Admissions → Applications.
 */
export const ADMISSION_PERMISSIONS = {
  view: 'admissions.applications:view',
  create: 'admissions.applications:create',
  edit: 'admissions.applications:edit',
  delete: 'admissions.applications:delete',
} as const

export const ADMISSION_STATUSES = ['under-review', 'approved', 'enrolled', 'rejected'] as const
export type AdmissionStatus = (typeof ADMISSION_STATUSES)[number]

export const DOCUMENT_STATUSES = ['submitted', 'verified', 'pending'] as const
export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number]

export const SEED_ADMISSION_APPLICATIONS = [
  {
    applicationNo: 'APP-2026-001',
    student: {
      firstName: 'Rohan',
      lastName: 'Verma',
      dateOfBirth: '2016-04-12',
      gender: 'male',
      gradeApplied: 5,
      bloodGroup: 'B+',
      previousSchool: 'St. Xavier Kindergarten, Bengaluru',
    },
    parent: {
      guardianType: 'father',
      name: 'Rajesh Verma',
      email: 'rajesh.verma@techcorp.in',
      phone: '+91 98450 11223',
      occupation: 'Software Architect',
      address: '42 Orchid Residency, Indiranagar, Bengaluru',
    },
    documents: [
      { name: 'Birth Certificate', status: 'verified' },
      { name: 'Transfer Certificate (TC)', status: 'submitted' },
      { name: 'Previous Grade Marksheet', status: 'verified' },
      { name: 'Aadhaar / ID Card Proof', status: 'verified' },
    ],
    status: 'under-review' as AdmissionStatus,
    appliedAt: new Date('2026-03-01T09:30:00.000Z'),
  },
  {
    applicationNo: 'APP-2026-002',
    student: {
      firstName: 'Ananya',
      lastName: 'Iyer',
      dateOfBirth: '2018-07-22',
      gender: 'female',
      gradeApplied: 3,
      bloodGroup: 'O+',
      previousSchool: 'National Public School, Indiranagar',
    },
    parent: {
      guardianType: 'mother',
      name: 'Pooja Iyer',
      email: 'pooja.iyer@gmail.com',
      phone: '+91 98765 43210',
      occupation: 'Chartered Accountant',
      address: '104 Palm Meadows, Whitefield, Bengaluru',
    },
    documents: [
      { name: 'Birth Certificate', status: 'verified' },
      { name: 'Transfer Certificate (TC)', status: 'verified' },
      { name: 'Immunization Record', status: 'verified' },
    ],
    status: 'approved' as AdmissionStatus,
    appliedAt: new Date('2026-02-28T14:15:00.000Z'),
    reviewedAt: new Date('2026-03-02T11:00:00.000Z'),
    reviewerNotes: 'All prerequisite documents verified. Excellent previous report card.',
  },
  {
    applicationNo: 'APP-2026-003',
    student: {
      firstName: 'Kabir',
      lastName: 'Deshmukh',
      dateOfBirth: '2014-11-05',
      gender: 'male',
      gradeApplied: 7,
      bloodGroup: 'A+',
      previousSchool: 'Delhi Public School, Pune',
    },
    parent: {
      guardianType: 'father',
      name: 'Sunil Deshmukh',
      email: 'sunil.deshmukh@gmail.com',
      phone: '+91 97654 32109',
      occupation: 'Mechanical Engineer',
      address: '12 Silver Oak Enclave, HSR Layout, Bengaluru',
    },
    documents: [
      { name: 'Birth Certificate', status: 'verified' },
      { name: 'Transfer Certificate (TC)', status: 'verified' },
      { name: 'Previous Grade Marksheet', status: 'verified' },
    ],
    status: 'enrolled' as AdmissionStatus,
    appliedAt: new Date('2026-02-20T10:00:00.000Z'),
    reviewedAt: new Date('2026-02-22T15:30:00.000Z'),
    reviewerNotes: 'Enrolled in Class 7 Section A.',
  },
  {
    applicationNo: 'APP-2026-004',
    student: {
      firstName: 'Meera',
      lastName: 'Patel',
      dateOfBirth: '2019-02-18',
      gender: 'female',
      gradeApplied: 1,
      bloodGroup: 'AB+',
      previousSchool: 'Little Angels Play School',
    },
    parent: {
      guardianType: 'father',
      name: 'Kiran Patel',
      email: 'kiran.patel@outlook.com',
      phone: '+91 99123 45678',
      occupation: 'Businessman',
      address: '78 Gardenia Towers, Koramangala, Bengaluru',
    },
    documents: [
      { name: 'Birth Certificate', status: 'verified' },
      { name: 'Address Proof', status: 'submitted' },
      { name: 'Transfer Certificate (TC)', status: 'pending' },
    ],
    status: 'under-review' as AdmissionStatus,
    appliedAt: new Date('2026-03-04T16:20:00.000Z'),
  },
  {
    applicationNo: 'APP-2026-005',
    student: {
      firstName: 'Dev',
      lastName: 'Kapoor',
      dateOfBirth: '2015-09-30',
      gender: 'male',
      gradeApplied: 6,
      bloodGroup: 'B-',
      previousSchool: 'Bishop Cotton Boys School',
    },
    parent: {
      guardianType: 'father',
      name: 'Vikas Kapoor',
      email: 'vikas.k@rediffmail.com',
      phone: '+91 98220 33445',
      occupation: 'Government Official',
      address: '5 Officers Quarters, MG Road, Bengaluru',
    },
    documents: [
      { name: 'Birth Certificate', status: 'verified' },
      { name: 'Previous Grade Marksheet', status: 'submitted' },
    ],
    status: 'rejected' as AdmissionStatus,
    appliedAt: new Date('2026-02-15T11:45:00.000Z'),
    reviewedAt: new Date('2026-02-18T10:00:00.000Z'),
    reviewerNotes: 'Class 6 capacity already reached for academic year 2026-2027.',
  },
]
