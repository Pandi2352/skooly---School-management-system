import type {
  AdmissionApplication,
  AdmissionStats,
  EnrollApplicantResult,
} from '../../schemas/admissionPipeline.schema'

export const samplePipelineApplications: AdmissionApplication[] = [
  {
    _id: 'app-seed-001',
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
      { name: 'Birth Certificate', status: 'verified', url: '/docs/sample_birth_cert.pdf' },
      { name: 'Previous School Transfer Certificate', status: 'verified', url: '/docs/sample_tc.pdf' },
      { name: 'Immunization Record', status: 'pending', url: '/docs/sample_immunization.pdf' },
    ],
    status: 'under-review',
    appliedAt: '2026-03-01T09:30:00.000Z',
    reviewerNotes: 'Pending final review of medical record.',
    createdAt: '2026-03-01T09:30:00.000Z',
    updatedAt: '2026-03-01T09:30:00.000Z',
  },
  {
    _id: 'app-seed-002',
    applicationNo: 'APP-2026-002',
    student: {
      firstName: 'Ananya',
      lastName: 'Sharma',
      dateOfBirth: '2015-08-25',
      gender: 'female',
      gradeApplied: 6,
      bloodGroup: 'O+',
      previousSchool: 'National Public School, Indiranagar',
    },
    parent: {
      guardianType: 'mother',
      name: 'Dr. Sunita Sharma',
      email: 'sunita.sharma@healthcenter.org',
      phone: '+91 98860 33445',
      occupation: 'Pediatrician',
      address: '15 Palm Meadows, Whitefield, Bengaluru',
    },
    documents: [
      { name: 'Birth Certificate', status: 'verified', url: '/docs/sample_birth_cert.pdf' },
      { name: 'Previous Marksheet', status: 'verified', url: '/docs/sample_marksheet.pdf' },
      { name: 'Address Proof', status: 'verified', url: '/docs/sample_address.pdf' },
    ],
    status: 'approved',
    appliedAt: '2026-03-02T11:15:00.000Z',
    reviewerNotes: 'All records verified by admissions office. Ready for class assignment.',
    createdAt: '2026-03-02T11:15:00.000Z',
    updatedAt: '2026-03-03T14:00:00.000Z',
  },
  {
    _id: 'app-seed-003',
    applicationNo: 'APP-2026-003',
    student: {
      firstName: 'Aarav',
      lastName: 'Nair',
      dateOfBirth: '2017-11-05',
      gender: 'male',
      gradeApplied: 3,
      bloodGroup: 'A+',
      previousSchool: 'Greenwood High Preschool',
    },
    parent: {
      guardianType: 'father',
      name: 'Suresh Nair',
      email: 'suresh.nair@aerofin.com',
      phone: '+91 97400 55667',
      occupation: 'Civil Engineer',
      address: '88 Lakeview Apartments, HSR Layout, Bengaluru',
    },
    documents: [
      { name: 'Birth Certificate', status: 'verified', url: '/docs/sample_birth_cert.pdf' },
      { name: 'Transfer Certificate', status: 'verified', url: '/docs/sample_tc.pdf' },
    ],
    status: 'enrolled',
    appliedAt: '2026-02-28T10:00:00.000Z',
    reviewerNotes: 'Successfully enrolled into Class 3-A.',
    enrolledStudentId: 'student-seed-aarav',
    enrolledAt: '2026-03-03T16:00:00.000Z',
    createdAt: '2026-02-28T10:00:00.000Z',
    updatedAt: '2026-03-03T16:00:00.000Z',
  },
  {
    _id: 'app-seed-004',
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
      { name: 'Birth Certificate', status: 'verified', url: '/docs/sample_birth_cert.pdf' },
      { name: 'Immunization Record', status: 'pending', url: '/docs/sample_immunization.pdf' },
    ],
    status: 'under-review',
    appliedAt: '2026-03-04T16:20:00.000Z',
    reviewerNotes: 'Awaiting parent interaction schedule.',
    createdAt: '2026-03-04T16:20:00.000Z',
    updatedAt: '2026-03-04T16:20:00.000Z',
  },
  {
    _id: 'app-seed-005',
    applicationNo: 'APP-2026-005',
    student: {
      firstName: 'Kabir',
      lastName: 'Khan',
      dateOfBirth: '2014-06-30',
      gender: 'male',
      gradeApplied: 7,
      bloodGroup: 'B-',
      previousSchool: 'St. Mary High School',
    },
    parent: {
      guardianType: 'mother',
      name: 'Farida Khan',
      email: 'farida.khan@designstudio.in',
      phone: '+91 96320 77889',
      occupation: 'Interior Designer',
      address: '201 Sunrise Enclave, Jayanagar, Bengaluru',
    },
    documents: [
      { name: 'Birth Certificate', status: 'rejected', url: '/docs/sample_birth_cert.pdf' },
      { name: 'Previous Marksheet', status: 'pending', url: '/docs/sample_marksheet.pdf' },
    ],
    status: 'rejected',
    appliedAt: '2026-03-02T13:40:00.000Z',
    reviewerNotes: 'Document verification failed: incomplete age criteria for Grade 7 transfer.',
    createdAt: '2026-03-02T13:40:00.000Z',
    updatedAt: '2026-03-04T10:00:00.000Z',
  },
]

const mutableApplications = [...samplePipelineApplications]

export function readSampleApplications(params?: {
  status?: string
  search?: string
  grade?: number
  page?: number
  limit?: number
}) {
  let filtered = [...mutableApplications]

  if (params?.status && params.status !== 'all') {
    filtered = filtered.filter((a) => a.status === params.status)
  }

  if (params?.grade) {
    filtered = filtered.filter((a) => a.student.gradeApplied === params.grade)
  }

  if (params?.search) {
    const term = params.search.toLowerCase()
    filtered = filtered.filter(
      (a) =>
        a.applicationNo.toLowerCase().includes(term) ||
        a.student.firstName.toLowerCase().includes(term) ||
        a.student.lastName.toLowerCase().includes(term) ||
        a.parent.name.toLowerCase().includes(term) ||
        a.parent.phone.toLowerCase().includes(term),
    )
  }

  const page = params?.page ?? 1
  const limit = params?.limit ?? 10
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const start = (page - 1) * limit
  const items = filtered.slice(start, start + limit)

  return {
    items,
    total,
    page,
    limit,
    totalPages,
  }
}

export function readSampleStats(): AdmissionStats {
  const total = mutableApplications.length
  const underReview = mutableApplications.filter((a) => a.status === 'under-review').length
  const approved = mutableApplications.filter((a) => a.status === 'approved').length
  const enrolled = mutableApplications.filter((a) => a.status === 'enrolled').length
  const rejected = mutableApplications.filter((a) => a.status === 'rejected').length

  return {
    total,
    underReview,
    approved,
    enrolled,
    rejected,
  }
}

export function updateSampleApplicationStatus(
  id: string,
  status: 'under-review' | 'approved' | 'rejected',
  reviewerNotes?: string,
): AdmissionApplication {
  const idx = mutableApplications.findIndex((a) => a._id === id || a.applicationNo === id)
  const target = idx >= 0 ? mutableApplications[idx] : undefined
  if (!target) {
    throw new Error(`Application ${id} not found`)
  }

  const updated: AdmissionApplication = {
    ...target,
    status,
    reviewerNotes: reviewerNotes ?? target.reviewerNotes,
    updatedAt: new Date().toISOString(),
  }

  mutableApplications[idx] = updated
  return updated
}

export function enrollSampleApplicant(
  id: string,
  section: string,
): EnrollApplicantResult {
  const idx = mutableApplications.findIndex((a) => a._id === id || a.applicationNo === id)
  const app = idx >= 0 ? mutableApplications[idx] : undefined
  if (!app) {
    throw new Error(`Application ${id} not found`)
  }

  const enrolledStudentId = `student-${Date.now()}`
  const admissionNo = `ADM-2026-${String(100 + idx).padStart(4, '0')}`
  const rollNo = `${app.student.gradeApplied}${section}-01`

  const updated: AdmissionApplication = {
    ...app,
    status: 'enrolled',
    enrolledStudentId,
    enrolledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  mutableApplications[idx] = updated

  return {
    success: true,
    studentId: enrolledStudentId,
    admissionNo,
    rollNo,
    message: `Enrolled ${app.student.firstName} ${app.student.lastName} into Grade ${app.student.gradeApplied}-${section}`,
  }
}
