import type { AdmissionFormValues } from '../types/admission.types'

/**
 * Creates a mock File instance for testing document uploads in browser environments.
 */
function createMockFile(name: string, type: string): File | null {
  if (typeof File !== 'undefined') {
    return new File(['%PDF-1.4 Mock document test file contents'], name, { type })
  }
  return null
}

/**
 * Preset 1: Male student (Rohan Verma), Class 5, Section A.
 * Includes student photo, full personal, academic, parental, health, bank, fees and document records.
 */
export function getMockAdmissionBoy(): AdmissionFormValues {
  return {
    academic: {
      admissionNo: 'ADM-2026-001',
      rollNo: '14',
      admissionDate: '2026-03-01',
      classGrade: '5',
      section: 'A',
      biometricId: 'BIO-5014',
      previousSchool: 'St. Xavier Primary School, Bengaluru',
      openingDue: '1500.00',
    },
    personal: {
      firstName: 'Rohan',
      middleName: 'Kumar',
      lastName: 'Verma',
      gender: 'male',
      dateOfBirth: '2016-04-12',
      category: 'general',
      house: 'blue',
      bloodGroup: 'B+',
      religion: 'hindu',
      nationalId: '9845-2231-9012',
      penId: 'PEN-2026-1049',
      caste: 'General',
      subCaste: 'Kayastha',
      motherTongue: 'Hindi',
      placeOfBirth: 'Bengaluru',
      nationality: 'Indian',
      belowPovertyLine: false,
      rightToEducation: false,
      phone: '+91 98450 11223',
      email: 'rohan.verma@student.skooly.in',
      photo: '/mock/student_photo_boy.jpg',
    },
    parents: {
      accountMode: 'new',
      existingParentId: '',
      guardian: 'father',
      fatherName: 'Rajesh Verma',
      fatherMiddleName: 'Kishore',
      fatherPhone: '+91 98450 11223',
      fatherOccupation: 'Senior Software Architect',
      fatherQualification: 'M.Tech Computer Science',
      fatherAadhaar: '5412 8901 2345',
      fatherIncome: '1850000',
      fatherPhoto: null,
      motherName: 'Priya Verma',
      motherMiddleName: 'Kumari',
      motherPhone: '+91 98450 44556',
      motherOccupation: 'Assistant Professor',
      motherQualification: 'Ph.D. Biotechnology',
      motherAadhaar: '5412 8901 6789',
      motherPhoto: null,
      guardianName: '',
      guardianRelation: '',
      guardianPhone: '',
      loginEmail: 'rajesh.verma@techcorp.in',
      emergencyName: 'Suresh Verma (Uncle)',
      emergencyPhone: '+91 98450 99887',
      guardianAddress:
        '42 Orchid Residency, 12th Main, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
      sameAsGuardianAddress: true,
      currentAddress:
        '42 Orchid Residency, 12th Main, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
      permanentAddress:
        '42 Orchid Residency, 12th Main, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
    },
    health: {
      medicalConditions: 'Mild seasonal asthma',
      allergies: 'Peanut allergy',
      heightCm: '138',
      weightKg: '32.5',
    },
    bank: {
      accountHolder: 'Rajesh Verma',
      bankName: 'State Bank of India',
      accountNumber: '30987654321',
      ifsc: 'SBIN0001234',
    },
    fees: {
      feeGroupIds: ['admission-2026', 'tuition-2026', 'computer-lab-2026', 'sports-2026'],
    },
    documents: {
      custom: {
        birthMarks: 'Small birthmark on left forearm',
      },
      files: [
        {
          name: 'Birth Certificate',
          file: createMockFile('birth_certificate_rohan.pdf', 'application/pdf'),
        },
        {
          name: 'Previous School Transfer Certificate',
          file: createMockFile('transfer_certificate_rohan.pdf', 'application/pdf'),
        },
        {
          name: 'Immunization Record',
          file: createMockFile('immunization_record_rohan.pdf', 'application/pdf'),
        },
      ],
    },
  }
}

/**
 * Preset 2: Female student (Ananya Sharma), Class 8, Section B.
 * Includes student photo, full personal, academic, parental, health, bank, fees and document records.
 */
export function getMockAdmissionGirl(): AdmissionFormValues {
  return {
    academic: {
      admissionNo: 'ADM-2026-002',
      rollNo: '21',
      admissionDate: '2026-03-02',
      classGrade: '8',
      section: 'B',
      biometricId: 'BIO-8021',
      previousSchool: 'National Public School, Indiranagar',
      openingDue: '0',
    },
    personal: {
      firstName: 'Ananya',
      middleName: 'Devi',
      lastName: 'Sharma',
      gender: 'female',
      dateOfBirth: '2013-08-25',
      category: 'general',
      house: 'green',
      bloodGroup: 'O+',
      religion: 'hindu',
      nationalId: '9845-7761-3421',
      penId: 'PEN-2026-2088',
      caste: 'General',
      subCaste: 'Brahmin',
      motherTongue: 'English',
      placeOfBirth: 'Bengaluru',
      nationality: 'Indian',
      belowPovertyLine: false,
      rightToEducation: false,
      phone: '+91 98860 33445',
      email: 'ananya.sharma@student.skooly.in',
      photo: '/mock/student_photo_girl.jpg',
    },
    parents: {
      accountMode: 'new',
      existingParentId: '',
      guardian: 'mother',
      fatherName: 'Vikram Sharma',
      fatherMiddleName: 'Nath',
      fatherPhone: '+91 98860 11224',
      fatherOccupation: 'Chartered Accountant',
      fatherQualification: 'FCA, B.Com',
      fatherAadhaar: '6723 4455 1209',
      fatherIncome: '2400000',
      fatherPhoto: null,
      motherName: 'Dr. Sunita Sharma',
      motherMiddleName: 'Rao',
      motherPhone: '+91 98860 33445',
      motherOccupation: 'Senior Pediatrician',
      motherQualification: 'MD Pediatrics, MBBS',
      motherAadhaar: '6723 4455 9812',
      motherPhoto: null,
      guardianName: '',
      guardianRelation: '',
      guardianPhone: '',
      loginEmail: 'sunita.sharma@healthcenter.org',
      emergencyName: 'Vikram Sharma (Father)',
      emergencyPhone: '+91 98860 11224',
      guardianAddress:
        '15 Palm Meadows, Varthur Road, Whitefield, Bengaluru, Karnataka 560066',
      sameAsGuardianAddress: true,
      currentAddress:
        '15 Palm Meadows, Varthur Road, Whitefield, Bengaluru, Karnataka 560066',
      permanentAddress:
        '15 Palm Meadows, Varthur Road, Whitefield, Bengaluru, Karnataka 560066',
    },
    health: {
      medicalConditions: 'None',
      allergies: 'No known allergies',
      heightCm: '152',
      weightKg: '42.0',
    },
    bank: {
      accountHolder: 'Dr. Sunita Sharma',
      bankName: 'HDFC Bank',
      accountNumber: '50100234567890',
      ifsc: 'HDFC0000128',
    },
    fees: {
      feeGroupIds: ['admission-2026', 'tuition-2026', 'library-2026', 'exam-2026', 'sports-2026'],
    },
    documents: {
      custom: {
        birthMarks: 'None',
      },
      files: [
        {
          name: 'Birth Certificate',
          file: createMockFile('birth_certificate_ananya.pdf', 'application/pdf'),
        },
        {
          name: 'Previous Grade Marksheet',
          file: createMockFile('marksheet_grade7_ananya.pdf', 'application/pdf'),
        },
        {
          name: 'Residential Address Proof',
          file: createMockFile('utility_bill_whitefield.pdf', 'application/pdf'),
        },
      ],
    },
  }
}
