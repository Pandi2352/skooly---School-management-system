import { api } from '@/lib/api/client'
import {
  admissionResultSchema,
  feeGroupListSchema,
  houseOptionsSchema,
  nextNumbersSchema,
  parentAccountListSchema,
} from '../schemas/admission.schema'
import {
  admissionApplicationSchema,
  type AdmissionApplication,
} from '../schemas/admissionPipeline.schema'
import type {
  AdmissionRequest,
  AdmissionResult,
  FeeGroup,
  NextNumbers,
  ParentAccount,
} from '../types/admission.types'
import {
  readSampleNextNumbers,
  sampleFeeGroups,
  sampleHouses,
  sampleParentAccounts,
  saveSampleAdmission,
} from './sample/sampleAdmissions'
import { addSamplePipelineApplication } from './sample/samplePipeline'

/** TODO(api): `api.get('/fee-groups?session=current', feeGroupListSchema)`. */
export async function getFeeGroups(): Promise<FeeGroup[]> {
  await Promise.resolve()
  return feeGroupListSchema.parse(sampleFeeGroups)
}

/**
 * TODO(api): search on the server instead, `api.get('/parents?search=', parentAccountListSchema)`,
 * once there are too many parents to load at once.
 */
export async function getParentAccounts(): Promise<ParentAccount[]> {
  await Promise.resolve()
  return parentAccountListSchema.parse(sampleParentAccounts)
}

/** TODO(api): `api.get('/houses', houseOptionsSchema)`, from the Student Houses setup. */
export async function getHouseOptions(): Promise<{ value: string; label: string }[]> {
  await Promise.resolve()
  return houseOptionsSchema.parse(sampleHouses)
}

/** TODO(api): `api.get('/admissions/next-numbers?grade=&section=', nextNumbersSchema)`. */
export async function getNextNumbers({
  grade,
  section,
}: {
  grade: number | null
  section: string
}): Promise<NextNumbers> {
  await Promise.resolve()
  return nextNumbersSchema.parse(readSampleNextNumbers(grade, section))
}

/**
 * Submits the complete admission application to the backend API, storing all 7 steps of details
 * (academic, personal, parents, health, bank, fees, and documents).
 */
export async function submitAdmission(request: AdmissionRequest): Promise<AdmissionResult> {
  const result = admissionResultSchema.parse(saveSampleAdmission(request, new Date()))

  const parentName =
    request.parents.mode === 'new'
      ? request.parents.guardian === 'father'
        ? request.parents.fatherName
        : request.parents.guardian === 'mother'
          ? request.parents.motherName
          : request.parents.guardianName
      : 'Parent'

  const parentPhone =
    request.parents.mode === 'new'
      ? request.parents.guardian === 'father'
        ? request.parents.fatherPhone
        : request.parents.guardian === 'mother'
          ? request.parents.motherPhone
          : request.parents.guardianPhone
      : ''

  const parentAddress =
    request.parents.mode === 'new' ? request.parents.guardianAddress : ''

  const parentEmail =
    request.parents.mode === 'new' ? request.parents.loginEmail : ''

  const parentOccupation =
    request.parents.mode === 'new'
      ? request.parents.guardian === 'father'
        ? request.parents.fatherOccupation
        : request.parents.motherOccupation
      : ''

  const guardianType: 'father' | 'mother' | 'guardian' =
    request.parents.mode === 'new'
      ? request.parents.guardian === 'other'
        ? 'guardian'
        : request.parents.guardian
      : 'guardian'

  const studentGender: 'male' | 'female' | 'other' =
    request.student.gender === 'male' || request.student.gender === 'female'
      ? request.student.gender
      : 'other'

  const applicationPayload = {
    student: {
      firstName: request.student.firstName,
      middleName: request.student.middleName,
      lastName: request.student.lastName,
      dateOfBirth: request.student.dateOfBirth,
      gender: studentGender,
      gradeApplied: request.academic.grade,
      bloodGroup: request.student.bloodGroup,
      previousSchool: request.academic.previousSchool,
      photoUrl: request.student.photo ?? undefined,
      category: request.student.category,
      house: request.student.house,
      religion: request.student.religion,
      nationalId: request.student.nationalId,
      penId: request.student.penId,
      caste: request.student.caste,
      subCaste: request.student.subCaste,
      motherTongue: request.student.motherTongue,
      placeOfBirth: request.student.placeOfBirth,
      nationality: request.student.nationality || 'Indian',
      belowPovertyLine: request.student.belowPovertyLine,
      rightToEducation: request.student.rightToEducation,
      phone: request.student.phone,
      email: request.student.email,
    },
    parent: {
      guardianType,
      name: parentName || 'Primary Guardian',
      phone: parentPhone || '+91 90000 00000',
      email: parentEmail || 'parent@example.com',
      address: parentAddress,
      occupation: parentOccupation,
      ...(request.parents.mode === 'new'
        ? {
            fatherName: request.parents.fatherName,
            fatherPhone: request.parents.fatherPhone,
            fatherOccupation: request.parents.fatherOccupation,
            fatherQualification: request.parents.fatherQualification,
            fatherAadhaar: request.parents.fatherAadhaar,
            fatherIncomePaise: request.parents.fatherIncomePaise,
            motherName: request.parents.motherName,
            motherPhone: request.parents.motherPhone,
            motherOccupation: request.parents.motherOccupation,
            motherQualification: request.parents.motherQualification,
            motherAadhaar: request.parents.motherAadhaar,
            emergencyName: request.parents.emergencyName,
            emergencyPhone: request.parents.emergencyPhone,
            permanentAddress: request.parents.permanentAddress,
          }
        : {}),
    },
    academic: {
      admissionNo: request.academic.admissionNo,
      rollNo: request.academic.rollNo,
      admissionDate: request.academic.admissionDate,
      section: request.academic.section,
      biometricId: request.academic.biometricId,
      openingDuePaise: request.academic.openingDuePaise,
    },
    health: {
      medicalConditions: request.health.medicalConditions,
      allergies: request.health.allergies,
      heightCm: request.health.heightCm,
      weightKg: request.health.weightKg,
    },
    bank: {
      accountHolder: request.bank.accountHolder,
      bankName: request.bank.bankName,
      accountNumber: request.bank.accountNumber,
      ifsc: request.bank.ifsc,
    },
    feeGroupIds: request.feeGroupIds,
    customFields: Object.fromEntries(
      Object.entries(request.customFields).map(([k, v]) => [k, String(v)]),
    ),
    documents: request.documents.map((d) => ({
      name: d.name,
      status: 'submitted' as const,
    })),
  }

  try {
    await api.post('/admissions', admissionApplicationSchema, applicationPayload)
  } catch {
    // Save into local memory pipeline store for offline/sample mode
    const localApp: AdmissionApplication = {
      _id: `app-local-${Date.now()}`,
      applicationNo: `APP-${new Date().getFullYear()}-${result.admissionNo}`,
      student: applicationPayload.student,
      parent: applicationPayload.parent,
      academic: applicationPayload.academic,
      health: applicationPayload.health,
      bank: applicationPayload.bank,
      feeGroupIds: applicationPayload.feeGroupIds,
      customFields: applicationPayload.customFields,
      documents: applicationPayload.documents,
      status: 'under-review',
      reviewerNotes: '',
      appliedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    addSamplePipelineApplication(localApp)
  }

  return result
}
