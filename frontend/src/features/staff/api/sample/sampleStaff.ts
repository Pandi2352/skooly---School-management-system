import type { StaffPage, StaffDetail, StaffStats } from '../../types/staff.types'

// Labelled sample source — deleted when GET /staff exists.
// All names, IDs and figures are illustrative.

export const SAMPLE_STAFF: StaffDetail[] = [
  {
    id: 'staff-001',
    photoUrl: null,
    personalInfo: {
      firstName: 'Priya',
      lastName: 'Sharma',
      dateOfBirth: '1988-03-15',
      gender: 'female',
      bloodGroup: 'B+',
      aadhaarNumber: '1234 5678 9012',
      religion: 'Hindu',
      category: 'General',
    },
    contactInfo: {
      phone: '+91 98450 11223',
      email: 'priya.sharma@skooly.in',
      address: '42 Orchid Residency, Indiranagar, Bengaluru 560038',
    },
    employment: {
      employeeId: 'EMP-0001',
      designation: 'Mathematics Teacher',
      department: 'Secondary',
      dateOfJoining: '2018-06-01',
      employmentType: 'permanent',
      status: 'active',
      salaryPaise: 4500000,
      reportingTo: 'Vice Principal',
    },
    qualifications: [
      { degree: 'M.Sc. Mathematics', institution: 'Bangalore University', year: '2010', grade: 'First Class' },
      { degree: 'B.Ed.', institution: 'Regional Institute of Education, Mysore', year: '2012', grade: 'First Class' },
    ],
    experience: [
      { institution: 'Delhi Public School, Pune', designation: 'Maths Teacher', from: '2012-06-01', to: '2018-03-31', isCurrent: false },
    ],
    leaveBalance: { casual: 10, medical: 8, earned: 12, maternity: 90, paternity: 0 },
    subjects: ['Mathematics', 'Applied Mathematics'],
    classes: ['9', '10', '11'],
    notes: '',
  },
  {
    id: 'staff-002',
    photoUrl: null,
    personalInfo: {
      firstName: 'Arjun',
      lastName: 'Mehta',
      dateOfBirth: '1985-07-22',
      gender: 'male',
      bloodGroup: 'O+',
    },
    contactInfo: {
      phone: '+91 98765 43210',
      email: 'arjun.mehta@skooly.in',
    },
    employment: {
      employeeId: 'EMP-0002',
      designation: 'Science Teacher',
      department: 'Senior Secondary',
      dateOfJoining: '2016-04-01',
      employmentType: 'permanent',
      status: 'active',
      salaryPaise: 5200000,
    },
    qualifications: [
      { degree: 'M.Sc. Physics', institution: 'IIT Bombay', year: '2008', grade: 'First Class with Distinction' },
      { degree: 'B.Ed.', institution: 'Pune University', year: '2009' },
    ],
    experience: [],
    leaveBalance: { casual: 12, medical: 12, earned: 15, maternity: 0, paternity: 15 },
    subjects: ['Physics', 'Chemistry'],
    classes: ['11', '12'],
    notes: '',
  },
  {
    id: 'staff-003',
    photoUrl: null,
    personalInfo: {
      firstName: 'Sunita',
      lastName: 'Rao',
      dateOfBirth: '1990-11-05',
      gender: 'female',
    },
    contactInfo: {
      phone: '+91 97654 32109',
      email: 'sunita.rao@skooly.in',
    },
    employment: {
      employeeId: 'EMP-0003',
      designation: 'English Teacher',
      department: 'Primary',
      dateOfJoining: '2020-06-15',
      employmentType: 'permanent',
      status: 'on-leave',
    },
    qualifications: [
      { degree: 'M.A. English Literature', institution: 'Delhi University', year: '2013' },
    ],
    experience: [],
    leaveBalance: { casual: 4, medical: 12, earned: 6, maternity: 45, paternity: 0 },
    subjects: ['English'],
    classes: ['3', '4', '5'],
    notes: 'Currently on maternity leave.',
  },
  {
    id: 'staff-004',
    photoUrl: null,
    personalInfo: {
      firstName: 'Deepak',
      lastName: 'Nair',
      dateOfBirth: '1982-01-30',
      gender: 'male',
    },
    contactInfo: {
      phone: '+91 99123 45678',
    },
    employment: {
      employeeId: 'EMP-0004',
      designation: 'Accountant',
      department: 'Accounts',
      dateOfJoining: '2015-09-01',
      employmentType: 'permanent',
      status: 'active',
      salaryPaise: 3800000,
    },
    qualifications: [
      { degree: 'B.Com', institution: 'Calicut University', year: '2004' },
    ],
    experience: [],
    leaveBalance: { casual: 12, medical: 10, earned: 15, maternity: 0, paternity: 15 },
    subjects: [],
    classes: [],
    notes: '',
  },
  {
    id: 'staff-005',
    photoUrl: null,
    personalInfo: {
      firstName: 'Meena',
      lastName: 'Krishnan',
      dateOfBirth: '1993-05-18',
      gender: 'female',
    },
    contactInfo: {
      phone: '+91 98220 33445',
      email: 'meena.krishnan@skooly.in',
    },
    employment: {
      employeeId: 'EMP-0005',
      designation: 'Hindi Teacher',
      department: 'Primary',
      dateOfJoining: '2022-07-01',
      employmentType: 'probation',
      status: 'active',
      salaryPaise: 3200000,
    },
    qualifications: [
      { degree: 'M.A. Hindi', institution: 'Mysore University', year: '2016' },
      { degree: 'B.Ed.', institution: 'Mysore University', year: '2017' },
    ],
    experience: [],
    leaveBalance: { casual: 12, medical: 12, earned: 5, maternity: 0, paternity: 0 },
    subjects: ['Hindi'],
    classes: ['1', '2', '3'],
    notes: 'Probation ends December 2026.',
  },
]

export const SAMPLE_STAFF_STATS: StaffStats = {
  total: 5,
  active: 3,
  onLeave: 1,
  resigned: 0,
  pendingLeaves: 2,
  openJobs: 1,
  byDepartment: {
    Primary: 2,
    Secondary: 1,
    'Senior Secondary': 1,
    Accounts: 1,
  },
}

export function querySampleStaff(filters: { search?: string; department?: string; status?: string; page?: number; limit?: number }): StaffPage {
  const { search = '', department = '', status = '', page = 1, limit = 20 } = filters
  let rows = SAMPLE_STAFF.map((s) => ({
    id: s.id,
    photoUrl: s.photoUrl,
    personalInfo: {
      firstName: s.personalInfo.firstName,
      middleName: s.personalInfo.middleName,
      lastName: s.personalInfo.lastName,
      gender: s.personalInfo.gender,
    },
    employment: s.employment,
    contactInfo: {
      phone: s.contactInfo.phone,
      email: s.contactInfo.email,
    },
  }))
  if (search) {
    const q = search.toLowerCase()
    rows = rows.filter(
      (r) =>
        r.personalInfo.firstName.toLowerCase().includes(q) ||
        r.personalInfo.lastName.toLowerCase().includes(q) ||
        r.employment.employeeId.toLowerCase().includes(q) ||
        r.employment.designation.toLowerCase().includes(q),
    )
  }
  if (department) rows = rows.filter((r) => r.employment.department === department)
  if (status) rows = rows.filter((r) => r.employment.status === status)
  const total = rows.length
  const start = (page - 1) * limit
  return {
    rows: rows.slice(start, start + limit),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / limit)),
  }
}
