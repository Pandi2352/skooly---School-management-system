import { pickCustomValues, type CustomField } from '@/features/customFields'
import type {
  AdmissionFormValues,
  AdmissionRequest,
  ParentAccount,
  ParentsRequest,
} from '../types/admission.types'
import { toDateInputValue } from './dates'

/** "1500.5" → 150050. Expects text that already passed the rupee amount check. */
export function rupeesToPaise(amount: string) {
  const [whole = '0', fraction = ''] = amount.trim().split('.')
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0').slice(0, 2))
}

/** Joins the name parts that were filled in: first, middle, last. */
export const fullName = (parts: string[]) =>
  parts
    .map((part) => part.trim())
    .filter((part) => part !== '')
    .join(' ')

function toParentsRequest(parents: AdmissionFormValues['parents']): ParentsRequest {
  if (parents.accountMode === 'existing') {
    return { mode: 'existing', parentId: parents.existingParentId }
  }
  const { sameAsGuardianAddress, fatherIncome, ...details } = parents
  return {
    ...details,
    mode: 'new',
    fatherIncomePaise: fatherIncome === '' ? null : rupeesToPaise(fatherIncome),
    permanentAddress: sameAsGuardianAddress ? details.guardianAddress : details.permanentAddress,
  }
}

export function toAdmissionRequest(
  values: AdmissionFormValues,
  customFields: CustomField[] = [],
): AdmissionRequest {
  const { classGrade, openingDue, ...academic } = values.academic
  const { firstName, middleName, lastName } = values.personal

  return {
    academic: {
      ...academic,
      grade: Number(classGrade),
      openingDuePaise: rupeesToPaise(openingDue),
    },
    student: {
      ...values.personal,
      name: fullName([firstName, middleName, lastName]),
    },
    parents: toParentsRequest(values.parents),
    health: values.health,
    bank: { ...values.bank, ifsc: values.bank.ifsc.toUpperCase() },
    feeGroupIds: values.fees.feeGroupIds,
    customFields: pickCustomValues(customFields, values.documents.custom),
    // Empty rows are skipped; validation has already made sure every other row has a file.
    documents: values.documents.files.flatMap((document) =>
      document.file === null
        ? []
        : [{ name: document.name, fileName: document.file.name, sizeBytes: document.file.size }],
    ),
  }
}

const digitsOnly = (text: string) => text.replace(/\D/g, '')

/**
 * Parent accounts matching a search by name, email or phone. Needs at least 2 characters, so the
 * list doesn't show every parent at once. Phone numbers match with or without spaces.
 */
export function filterParentAccounts(accounts: ParentAccount[], query: string) {
  const text = query.trim().toLowerCase()
  if (text.length < 2) return []
  const digits = digitsOnly(text)
  return accounts.filter(
    (account) =>
      account.name.toLowerCase().includes(text) ||
      account.email.toLowerCase().includes(text) ||
      (digits.length >= 2 && digitsOnly(account.phone).includes(digits)),
  )
}

/** A blank form, dated today. */
export function createEmptyAdmission(today: Date): AdmissionFormValues {
  return {
    academic: {
      admissionNo: '',
      rollNo: '',
      admissionDate: toDateInputValue(today),
      classGrade: '',
      section: '',
      biometricId: '',
      previousSchool: '',
      openingDue: '0',
    },
    personal: {
      firstName: '',
      middleName: '',
      lastName: '',
      gender: '',
      dateOfBirth: '',
      category: '',
      house: '',
      bloodGroup: '',
      religion: '',
      nationalId: '',
      penId: '',
      caste: '',
      subCaste: '',
      motherTongue: '',
      placeOfBirth: '',
      // Most students at an Indian school; change it for anyone else.
      nationality: 'Indian',
      belowPovertyLine: false,
      rightToEducation: false,
      phone: '',
      email: '',
      photo: null,
    },
    parents: {
      accountMode: 'new',
      existingParentId: '',
      guardian: 'father',
      fatherName: '',
      fatherMiddleName: '',
      fatherPhone: '',
      fatherOccupation: '',
      fatherQualification: '',
      fatherAadhaar: '',
      fatherIncome: '',
      fatherPhoto: null,
      motherName: '',
      motherMiddleName: '',
      motherPhone: '',
      motherOccupation: '',
      motherQualification: '',
      motherAadhaar: '',
      motherPhoto: null,
      guardianName: '',
      guardianRelation: '',
      guardianPhone: '',
      loginEmail: '',
      emergencyName: '',
      emergencyPhone: '',
      guardianAddress: '',
      sameAsGuardianAddress: false,
      currentAddress: '',
      permanentAddress: '',
    },
    health: {
      medicalConditions: '',
      allergies: '',
      heightCm: '',
      weightKg: '',
    },
    bank: {
      accountHolder: '',
      bankName: '',
      accountNumber: '',
      ifsc: '',
    },
    fees: { feeGroupIds: [] },
    // One empty row to start; it's ignored if left empty.
    documents: { custom: {}, files: [{ name: '', file: null }] },
  }
}
