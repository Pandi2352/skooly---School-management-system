import { describe, expect, it } from 'vitest'
import { studentDetailSchema } from './studentDetail.schema'

describe('studentDetailSchema', () => {
  const validDetail = {
    id: 'sample-01',
    admissionNo: 'SAMPLE-0001',
    name: 'Aarav Sharma',
    grade: 5,
    section: 'A',
    guardianName: 'Rajesh Sharma',
    guardianPhone: '+91 98765 43210',
    fatherName: 'Rajesh Sharma',
    fatherPhone: '+91 98765 43210',
    photoUrl: null,
    siblingCount: 1,
    totalAssignedPaise: 12000000,
    totalDuePaise: 0,
    enrollmentStatus: 'enrolled' as const,
    feeStatus: 'paid' as const,
    rollNo: '05',
    dob: '2015-08-14',
    gender: 'male' as const,
    bloodGroup: 'B+',
    admissionDate: '2021-06-01',
    residentialAddress: 'Flat 402, Shanti Vihar, MG Road',
    city: 'Bengaluru',
    pincode: '560001',
    primaryGuardian: {
      name: 'Rajesh Sharma',
      relation: 'Father',
      phone: '+91 98765 43210',
      email: 'rajesh.sharma@example.com',
      occupation: 'Software Engineer',
    },
    siblings: [
      {
        id: 'sample-02',
        name: 'Ananya Sharma',
        grade: 3,
        section: 'B',
        relationship: 'Sister',
      },
    ],
    medical: {
      bloodGroup: 'B+',
      allergies: ['Peanuts'],
      medications: [],
      emergencyContact: {
        name: 'Sunita Sharma',
        relation: 'Mother',
        phone: '+91 98765 43211',
      },
      doctorNotes: 'Carries EpiPen for severe peanut allergy.',
    },
    feeSummary: {
      totalBilledPaise: 12000000,
      totalPaidPaise: 12000000,
      balanceDuePaise: 0,
      status: 'paid' as const,
    },
    invoices: [
      {
        id: 'inv-1',
        invoiceNo: 'INV-2026-001',
        title: 'Term 1 Tuition Fee',
        dueDate: '2026-04-10',
        amountPaise: 6000000,
        paidPaise: 6000000,
        status: 'paid' as const,
      },
    ],
    attendanceSummary: {
      presentDays: 172,
      absentDays: 8,
      lateDays: 2,
      totalDays: 182,
      percentage: 94.5,
    },
    recentAttendance: [
      {
        date: '2026-09-12',
        status: 'present' as const,
      },
    ],
    documents: [
      {
        id: 'doc-1',
        title: 'Birth Certificate',
        type: 'birth_certificate' as const,
        uploadDate: '2021-06-01',
        fileSizeBytes: 1048576,
        fileUrl: '/documents/birth-cert.pdf',
      },
    ],
  }

  it('validates a complete student detail object', () => {
    const parsed = studentDetailSchema.parse(validDetail)
    expect(parsed.id).toBe('sample-01')
    expect(parsed.name).toBe('Aarav Sharma')
    expect(parsed.primaryGuardian.relation).toBe('Father')
    expect(parsed.siblings).toHaveLength(1)
    expect(parsed.attendanceSummary.percentage).toBe(94.5)
  })

  it('rejects an invalid gender or enrollment status', () => {
    expect(() =>
      studentDetailSchema.parse({
        ...validDetail,
        gender: 'unknown-gender',
      }),
    ).toThrow()
  })

  it('rejects negative fee amounts or percentages over 100', () => {
    expect(() =>
      studentDetailSchema.parse({
        ...validDetail,
        attendanceSummary: {
          ...validDetail.attendanceSummary,
          percentage: 105,
        },
      }),
    ).toThrow()
  })
})
