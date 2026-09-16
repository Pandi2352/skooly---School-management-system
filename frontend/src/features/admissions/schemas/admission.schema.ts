import { z } from 'zod'
import {
  BLOOD_GROUPS,
  GENDERS,
  GUARDIAN_TYPES,
  PARENT_ACCOUNT_MODES,
  RELIGIONS,
  SOCIAL_CATEGORIES,
} from '../constants'
import { isPastDateInput, isValidDateInput } from '../utils/dates'

// One object per step, so "Next Step" can check just that step with `trigger('academic')`.

const PHONE = /^\+?[\d\s-]{7,16}$/
const PHONE_MESSAGE = 'Enter a valid phone number, like 98765 43210'
const AADHAAR = /^\d{4}\s?\d{4}\s?\d{4}$/
const AADHAAR_MESSAGE = 'Enter the 12-digit Aadhaar number'
const RUPEES = /^\d{1,10}(\.\d{1,2})?$/

const tooLong = (max: number) => `Use ${max} characters or fewer`
const requiredText = (message: string, max: number) =>
  z.string().trim().min(1, message).max(max, tooLong(max))
const optionalText = (max: number) => z.string().trim().max(max, tooLong(max))
const optionalMatch = (pattern: RegExp, message: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === '' || pattern.test(value), message)
const optionalEmail = z
  .string()
  .trim()
  .refine(
    (value) => value === '' || z.email().safeParse(value).success,
    'Enter a valid email address, like parent@example.com',
  )

export const academicStepSchema = z.object({
  admissionNo: requiredText('Enter the admission number, or press Auto', 30),
  rollNo: requiredText('Enter the roll number, or press Auto', 30),
  admissionDate: z.string().refine(isValidDateInput, 'Choose the admission date'),
  /** The class's grade as text, as the select gives it. */
  classGrade: z.string().min(1, 'Choose a class'),
  section: z.string().min(1, 'Choose a section'),
  biometricId: optionalText(30),
  previousSchool: optionalText(500),
  /** Rupees as typed; converted to paise when submitted. */
  openingDue: z
    .string()
    .trim()
    .regex(/^\d{1,9}(\.\d{1,2})?$/, 'Enter an amount in rupees, like 1500 or 1500.50'),
})

export const personalStepSchema = z
  .object({
    firstName: requiredText('Enter the student’s first name', 60),
    middleName: optionalText(60),
    lastName: optionalText(60),
    gender: z.union([z.enum(GENDERS), z.literal('')]),
    dateOfBirth: z
      .string()
      .refine(isValidDateInput, 'Enter the date of birth')
      .refine((value) => isPastDateInput(value), 'The date of birth must be before today'),
    category: z.union([z.enum(SOCIAL_CATEGORIES), z.literal('')]),
    /** A house id from the school's list, or '' for none. */
    house: optionalText(40),
    bloodGroup: z.union([z.enum(BLOOD_GROUPS), z.literal('')]),
    religion: z.union([z.enum(RELIGIONS), z.literal('')]),
    nationalId: optionalMatch(
      /^[A-Za-z0-9 -]{4,20}$/,
      'Use 4 to 20 letters, numbers, spaces or dashes',
    ),
    penId: optionalMatch(/^[A-Za-z0-9-]{4,20}$/, 'Use 4 to 20 letters, numbers or dashes'),
    caste: optionalText(40),
    subCaste: optionalText(40),
    motherTongue: optionalText(40),
    placeOfBirth: optionalText(60),
    nationality: optionalText(40),
    belowPovertyLine: z.boolean(),
    rightToEducation: z.boolean(),
    phone: optionalMatch(PHONE, PHONE_MESSAGE),
    email: optionalEmail,
    /** Data URL of the uploaded or webcam photo, or null. */
    photo: z.string().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.gender === '') {
      ctx.addIssue({ code: 'custom', path: ['gender'], message: 'Choose a gender' })
    }
  })

export const parentsStepSchema = z
  .object({
    /** Create a new parent account, or link the student to one the school already has. */
    accountMode: z.enum(PARENT_ACCOUNT_MODES),
    existingParentId: z.string(),
    guardian: z.enum(GUARDIAN_TYPES),
    fatherName: optionalText(80),
    fatherMiddleName: optionalText(60),
    fatherPhone: optionalMatch(PHONE, PHONE_MESSAGE),
    fatherOccupation: optionalText(60),
    fatherQualification: optionalText(60),
    fatherAadhaar: optionalMatch(AADHAAR, AADHAAR_MESSAGE),
    /** Rupees a year as typed; sent in paise. */
    fatherIncome: optionalMatch(RUPEES, 'Enter the yearly income in rupees, like 350000'),
    fatherPhoto: z.string().nullable(),
    motherName: optionalText(80),
    motherMiddleName: optionalText(60),
    motherPhone: optionalMatch(PHONE, PHONE_MESSAGE),
    motherOccupation: optionalText(60),
    motherQualification: optionalText(60),
    motherAadhaar: optionalMatch(AADHAAR, AADHAAR_MESSAGE),
    motherPhoto: z.string().nullable(),
    guardianName: optionalText(80),
    guardianRelation: optionalText(40),
    guardianPhone: optionalMatch(PHONE, PHONE_MESSAGE),
    loginEmail: optionalEmail,
    emergencyName: optionalText(80),
    emergencyPhone: optionalMatch(PHONE, PHONE_MESSAGE),
    guardianAddress: optionalText(300),
    sameAsGuardianAddress: z.boolean(),
    currentAddress: optionalText(300),
    permanentAddress: optionalText(300),
  })
  .superRefine((parents, ctx) => {
    const require = (path: string, value: string, message: string) => {
      if (value === '') ctx.addIssue({ code: 'custom', path: [path], message })
    }
    if (parents.accountMode === 'existing') {
      require('existingParentId', parents.existingParentId, 'Choose a parent account, or create a new one')
      return
    }
    if (parents.guardian === 'father') {
      require('fatherName', parents.fatherName, 'Enter the father’s name')
      require('fatherPhone', parents.fatherPhone, 'Enter the father’s phone number')
    } else if (parents.guardian === 'mother') {
      require('motherName', parents.motherName, 'Enter the mother’s name')
      require('motherPhone', parents.motherPhone, 'Enter the mother’s phone number')
    } else {
      require('guardianName', parents.guardianName, 'Enter the guardian’s name')
      require('guardianRelation', parents.guardianRelation, 'Enter how they’re related, like Uncle')
      require('guardianPhone', parents.guardianPhone, 'Enter the guardian’s phone number')
    }
  })

export const healthStepSchema = z.object({
  medicalConditions: optionalText(500),
  allergies: optionalText(300),
  heightCm: optionalMatch(/^\d{2,3}(\.\d)?$/, 'Enter height in centimetres, like 142'),
  weightKg: optionalMatch(/^\d{1,3}(\.\d)?$/, 'Enter weight in kilograms, like 36.5'),
})

export const bankStepSchema = z
  .object({
    accountHolder: optionalText(80),
    bankName: optionalText(80),
    accountNumber: optionalMatch(/^\d{9,18}$/, 'Enter the account number: 9 to 18 digits'),
    ifsc: optionalMatch(
      /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/,
      'Enter the 11-character IFSC, like SBIN0001234',
    ),
  })
  .superRefine((bank, ctx) => {
    // Bank details are optional, but once started they must be complete enough to use.
    const started = Object.values(bank).some((value) => value !== '')
    if (!started) return
    const require = (path: string, value: string, message: string) => {
      if (value === '') ctx.addIssue({ code: 'custom', path: [path], message })
    }
    require('accountHolder', bank.accountHolder, 'Enter the account holder’s name')
    require('accountNumber', bank.accountNumber, 'Enter the account number')
    require('ifsc', bank.ifsc, 'Enter the IFSC')
  })

export const feesStepSchema = z.object({
  feeGroupIds: z.array(z.string()),
})

/** A row left completely empty is ignored; a half-filled row needs both a name and a file. */
export const admissionDocumentSchema = z
  .object({
    name: optionalText(80),
    file: z.instanceof(File).nullable(),
  })
  .superRefine((document, ctx) => {
    if (document.file !== null && document.name === '') {
      ctx.addIssue({
        code: 'custom',
        path: ['name'],
        message: 'Name the document, like Birth Certificate',
      })
    }
    if (document.file === null && document.name !== '') {
      ctx.addIssue({ code: 'custom', path: ['file'], message: 'Choose a file for this document' })
    }
  })

export const documentsStepSchema = z.object({
  /**
   * Answers to the school's custom fields, keyed by field key. Their rules come from settings at
   * run time, so they're checked with `validateCustomValues` on submit, not here.
   */
  custom: z.record(z.string(), z.union([z.string(), z.boolean()])),
  files: z.array(admissionDocumentSchema),
})

export const admissionFormSchema = z.object({
  academic: academicStepSchema,
  personal: personalStepSchema,
  parents: parentsStepSchema,
  health: healthStepSchema,
  bank: bankStepSchema,
  fees: feesStepSchema,
  documents: documentsStepSchema,
})

/** What the API returns after admitting a student. */
export const admissionResultSchema = z.object({
  id: z.string(),
  admissionNo: z.string(),
  rollNo: z.string(),
  studentName: z.string(),
  grade: z.number().int(),
  section: z.string(),
})

/** A parent account the school already has, for "Link to Existing Parent Account". */
export const parentAccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  /** Their children already at the school, e.g. "Sample Student 03 (Class 4 A)". */
  children: z.array(z.string()),
})

export const parentAccountListSchema = z.array(parentAccountSchema)

/** A fee group the school has set up, such as "Tuition Fees 2026-2027". */
export const feeGroupSchema = z.object({ id: z.string(), name: z.string() })

export const feeGroupListSchema = z.array(feeGroupSchema)

/** The school's houses, for the House select. */
export const houseOptionsSchema = z.array(z.object({ value: z.string(), label: z.string() }))

/** Counters for the next admission and roll numbers; formats come from School Settings. */
export const nextNumbersSchema = z.object({
  admissionCounter: z.number().int().min(1),
  /** Null until a class and section are chosen. */
  rollCounter: z.number().int().min(1).nullable(),
})
