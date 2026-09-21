import type { StudentDetail } from '../../types/student.types'
import { sampleStudents } from './sampleStudents'

const BLOOD_GROUPS = ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-']
const GENDERS: ('male' | 'female')[] = ['male', 'female']

const sampleStudentDetailsCache = new Map<string, StudentDetail>()

/**
 * Returns complete profile details for a sample student.
 * Returns null if the student ID is not found.
 */
export function getSampleStudentDetail(studentId: string): StudentDetail | null {
  const cached = sampleStudentDetailsCache.get(studentId)
  if (cached) return cached

  const student = sampleStudents.find((s) => s.id === studentId)
  if (!student) return null

  const index = sampleStudents.indexOf(student)
  const isFemale = index % 2 !== 0
  const gender = GENDERS[isFemale ? 1 : 0] ?? 'male'
  const bloodGroup = BLOOD_GROUPS[index % BLOOD_GROUPS.length] ?? 'O+'
  const rollNo = String((index % 35) + 1).padStart(2, '0')

  // Calculate fees consistent with student.feeStatus
  const term1Paise = 4000000 // ₹40,000
  const term2Paise = 4000000 // ₹40,000
  const term3Paise = 4000000 // ₹40,000
  const totalBilled = term1Paise + term2Paise + term3Paise

  let totalPaid = totalBilled
  let balanceDue = 0
  let inv3Status: 'paid' | 'due' | 'overdue' = 'paid'
  let inv3Paid = term3Paise

  if (student.feeStatus === 'due') {
    inv3Status = 'due'
    inv3Paid = 0
    totalPaid = term1Paise + term2Paise
    balanceDue = term3Paise
  } else if (student.feeStatus === 'overdue') {
    inv3Status = 'overdue'
    inv3Paid = 0
    totalPaid = term1Paise + term2Paise
    balanceDue = term3Paise
  }

  // Linked sibling if another student in sample data
  const siblingCandidate = sampleStudents[(index + 1) % sampleStudents.length]
  const siblings =
    index % 3 !== 0 && siblingCandidate && siblingCandidate.id !== student.id
      ? [
          {
            id: siblingCandidate.id,
            name: siblingCandidate.name,
            grade: siblingCandidate.grade,
            section: siblingCandidate.section,
            relationship: isFemale ? 'Brother' : 'Sister',
          },
        ]
      : []

  return {
    ...student,
    category: index % 3 === 0 ? 'General' : index % 3 === 1 ? 'OBC' : 'SC',
    house: ['red', 'blue', 'green', 'yellow'][index % 4],
    religion: index % 2 === 0 ? 'Hindu' : 'Muslim',
    nationalId: `9845-3321-${String(1000 + index)}`,
    penId: `PEN-2026-${String(4000 + index)}`,
    caste: 'General',
    subCaste: 'Urban',
    motherTongue: 'Kannada',
    placeOfBirth: 'Bengaluru',
    nationality: 'Indian',
    belowPovertyLine: index % 7 === 0,
    rightToEducation: index % 5 === 0,
    biometricId: `BIO-${String(900 + index)}`,
    previousSchool: 'National Public Primary School',
    heightCm: String(130 + (index % 25)),
    weightKg: String(30 + (index % 15)),
    studentPhone: `+91 98450 ${String(10000 + index)}`,
    studentEmail: `${student.name.toLowerCase().replace(/\s+/g, '.')}@student.skooly.edu`,
    bank: {
      bankName: 'State Bank of India',
      accountNumber: `309876543${String(10 + index)}`,
      ifscCode: 'SBIN0001234',
      accountHolderName: student.guardianName,
    },
    parents: {
      fatherName: student.guardianName,
      fatherPhone: student.guardianPhone,
      fatherOccupation: 'Senior Software Engineer',
      fatherQualification: 'B.Tech / M.S.',
      fatherAadhaar: `5412 8901 ${String(2300 + index)}`,
      fatherIncomePaise: 180000000,
      motherName: `Mrs. Priya ${student.guardianName.split(' ')[1] ?? 'Verma'}`,
      motherPhone: `+91 91234 567${String(index).padStart(2, '0')}`,
      motherOccupation: 'Professor',
      motherQualification: 'Ph.D. Education',
      motherAadhaar: `6723 4455 ${String(9800 + index)}`,
      emergencyName: student.guardianName,
      emergencyPhone: student.guardianPhone,
      permanentAddress: 'Flat 304, Green Meadows, 14th Cross, Indiranagar, Bengaluru',
    },
    rollNo,
    dob: `201${Math.max(0, 8 - Math.floor(student.grade / 2))}-05-15`,
    gender,
    bloodGroup,
    admissionDate: '2021-06-01',
    residentialAddress: 'Flat 304, Green Meadows, 14th Cross, Indiranagar',
    city: 'Bengaluru',
    pincode: '560038',
    primaryGuardian: {
      name: student.guardianName,
      relation: 'Father',
      phone: student.guardianPhone,
      email: `${student.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      occupation: 'Civil Engineer',
      address: 'Flat 304, Green Meadows, 14th Cross, Indiranagar, Bengaluru',
    },
    secondaryGuardian: {
      name: `Mrs. ${student.guardianName.split(' ')[1] ?? 'Guardian'}`,
      relation: 'Mother',
      phone: `+91 91234 567${String(index).padStart(2, '0')}`,
      email: '',
      occupation: 'Architect',
      address: 'Flat 304, Green Meadows, 14th Cross, Indiranagar, Bengaluru',
    },
    siblings,
    medical: {
      bloodGroup,
      allergies: index % 4 === 0 ? ['Peanuts', 'Dust'] : [],
      medications: index % 5 === 0 ? ['Inhaler as needed'] : [],
      emergencyContact: {
        name: student.guardianName,
        relation: 'Father',
        phone: student.guardianPhone,
      },
      doctorNotes: index % 4 === 0 ? 'Carries emergency medication with class teacher.' : '',
    },
    feeSummary: {
      totalBilledPaise: totalBilled,
      totalPaidPaise: totalPaid,
      balanceDuePaise: balanceDue,
      status: student.feeStatus,
    },
    invoices: [
      {
        id: `inv-${student.id}-1`,
        invoiceNo: `INV-26-0${index}1`,
        title: 'Term 1 Tuition & Infrastructure Fee',
        dueDate: '2026-04-10',
        amountPaise: term1Paise,
        paidPaise: term1Paise,
        status: 'paid',
      },
      {
        id: `inv-${student.id}-2`,
        invoiceNo: `INV-26-0${index}2`,
        title: 'Term 2 Tuition & Activity Fee',
        dueDate: '2026-08-10',
        amountPaise: term2Paise,
        paidPaise: term2Paise,
        status: 'paid',
      },
      {
        id: `inv-${student.id}-3`,
        invoiceNo: `INV-26-0${index}3`,
        title: 'Term 3 Tuition & Examination Fee',
        dueDate: '2026-11-10',
        amountPaise: term3Paise,
        paidPaise: inv3Paid,
        status: inv3Status,
      },
    ],
    attendanceSummary: {
      presentDays: 168 - (index % 12),
      absentDays: 10 + (index % 8),
      lateDays: 2 + (index % 4),
      totalDays: 180,
      percentage: Math.round(((168 - (index % 12)) / 180) * 1000) / 10,
    },
    recentAttendance: [
      { date: '2026-09-12', status: 'present' },
      { date: '2026-09-11', status: 'present' },
      { date: '2026-09-10', status: index % 7 === 0 ? 'absent' : 'present' },
      { date: '2026-09-09', status: 'present' },
      { date: '2026-09-08', status: index % 5 === 0 ? 'late' : 'present' },
      { date: '2026-09-05', status: 'present' },
      { date: '2026-09-04', status: 'present' },
      { date: '2026-09-03', status: 'present' },
      { date: '2026-09-02', status: 'present' },
      { date: '2026-09-01', status: 'present' },
    ],
    documents: [
      {
        id: `doc-${student.id}-1`,
        title: 'Birth Certificate',
        type: 'birth_certificate',
        uploadDate: '2021-06-01',
        fileSizeBytes: 1240500,
        fileUrl: '#',
      },
      {
        id: `doc-${student.id}-2`,
        title: 'Previous School Transfer Certificate',
        type: 'transfer_certificate',
        uploadDate: '2021-06-01',
        fileSizeBytes: 890100,
        fileUrl: '#',
      },
      {
        id: `doc-${student.id}-3`,
        title: 'Annual Health & Immunization Record',
        type: 'medical_record',
        uploadDate: '2026-06-15',
        fileSizeBytes: 654200,
        fileUrl: '#',
      },
      {
        id: `doc-${student.id}-4`,
        title: 'Government Identity Proof (Aadhaar Card)',
        type: 'id_proof',
        uploadDate: '2021-06-01',
        fileSizeBytes: 420800,
        fileUrl: '#',
      },
    ],
  }
}

/**
 * Updates a sample student detail in memory so changes are immediately viewable across the app.
 */
export function updateSampleStudentDetail(
  studentId: string,
  updates: Partial<StudentDetail>,
): StudentDetail {
  const current = getSampleStudentDetail(studentId)
  if (!current) {
    throw new Error(`Student ${studentId} not found`)
  }

  const updated: StudentDetail = {
    ...current,
    ...updates,
    parents: updates.parents
      ? { ...(current.parents ?? {}), ...updates.parents }
      : current.parents,
    bank: updates.bank
      ? { ...(current.bank ?? {}), ...updates.bank }
      : current.bank,
    medical: updates.medical
      ? { ...current.medical, ...updates.medical }
      : current.medical,
  }

  sampleStudentDetailsCache.set(studentId, updated)
  return updated
}
