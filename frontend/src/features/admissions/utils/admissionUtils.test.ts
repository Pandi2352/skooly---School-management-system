import { describe, expect, it } from 'vitest'
import { admissionFormSchema } from '../schemas/admission.schema'
import type { AdmissionFormValues } from '../types/admission.types'
import {
  createEmptyAdmission,
  filterParentAccounts,
  rupeesToPaise,
  toAdmissionRequest,
} from './admissionRequest'
import { firstStepWithErrors, nextStep, previousStep, stepProgress } from './admissionSteps'
import { isPastDateInput, isValidDateInput, parseDateInput } from './dates'
import { formatFileSize, validateDocumentFile } from './documentFiles'
import { addIds, filterFeeGroups, removeIds, toggleId } from './feeGroups'

const today = new Date(2026, 8, 14)
const pdf = () => new File(['a'], 'birth.pdf', { type: 'application/pdf' })

function filledAdmission(): AdmissionFormValues {
  const values = createEmptyAdmission(today)
  return {
    ...values,
    academic: {
      ...values.academic,
      admissionNo: 'ADM-1',
      rollNo: 'R-1',
      classGrade: '5',
      section: 'A',
      openingDue: '1500.5',
    },
    personal: {
      ...values.personal,
      firstName: ' Sample ',
      lastName: 'Student',
      gender: 'female',
      dateOfBirth: '2016-04-01',
      penId: 'PEN-1234',
    },
    parents: {
      ...values.parents,
      fatherName: 'Sample Guardian',
      fatherPhone: '98765 43210',
      fatherIncome: '350000',
      guardianAddress: 'Sample address',
      sameAsGuardianAddress: true,
    },
    bank: {
      ...values.bank,
      accountHolder: 'Sample Guardian',
      accountNumber: '123456789',
      ifsc: 'sbin0001234',
    },
    fees: { feeGroupIds: ['tuition'] },
    documents: {
      custom: {},
      files: [
        { name: 'Birth Certificate', file: pdf() },
        { name: '', file: null },
      ],
    },
  }
}

const messages = (values: AdmissionFormValues) => {
  const result = admissionFormSchema.safeParse(values)
  return result.success ? [] : result.error.issues.map((issue) => issue.message)
}

describe('admission steps', () => {
  it('moves between steps and reports progress', () => {
    expect(nextStep('health')).toBe('bank')
    expect(nextStep('documents')).toBeNull()
    expect(previousStep('academic')).toBeNull()
    expect(stepProgress('academic')).toBe(14)
    expect(stepProgress('documents')).toBe(100)
    expect(firstStepWithErrors({ bank: {}, parents: {} })).toBe('parents')
  })
})

describe('dates', () => {
  it('accepts only real calendar dates before today', () => {
    expect(isValidDateInput('2026-02-30')).toBe(false)
    expect(parseDateInput('2026-09-14')?.getDate()).toBe(14)
    expect(isPastDateInput('2026-09-13', today)).toBe(true)
    expect(isPastDateInput('2026-09-14', today)).toBe(false)
  })
})

describe('toAdmissionRequest', () => {
  it('converts money to paise, joins the name and copies the address', () => {
    const request = toAdmissionRequest(filledAdmission())
    expect(rupeesToPaise('1500')).toBe(150000)
    expect(request.academic).toMatchObject({ grade: 5, openingDuePaise: 150050 })
    expect(request.student).toMatchObject({ name: 'Sample Student', nationality: 'Indian' })
    expect(request.parents).toMatchObject({
      mode: 'new',
      permanentAddress: 'Sample address',
      fatherIncomePaise: 35000000,
    })
    expect(request.bank.ifsc).toBe('SBIN0001234')
    expect(request.feeGroupIds).toEqual(['tuition'])
  })

  it('sends only document rows that have a file', () => {
    expect(toAdmissionRequest(filledAdmission()).documents).toEqual([
      { name: 'Birth Certificate', fileName: 'birth.pdf', sizeBytes: 1 },
    ])
  })

  it('passes validation when every required field is filled', () => {
    expect(admissionFormSchema.safeParse(filledAdmission()).success).toBe(true)
  })
})

describe('admission rules', () => {
  it('requires the chosen guardian’s details', () => {
    const values = filledAdmission()
    expect(messages({ ...values, parents: { ...values.parents, guardian: 'other' } })).toEqual([
      'Enter the guardian’s name',
      'Enter how they’re related, like Uncle',
      'Enter the guardian’s phone number',
    ])
  })

  it('asks only for the parent account when linking to an existing one', () => {
    const values = filledAdmission()
    const linked = {
      ...values.parents,
      accountMode: 'existing' as const,
      fatherName: '',
      fatherPhone: '',
    }
    expect(messages({ ...values, parents: linked })).toEqual([
      'Choose a parent account, or create a new one',
    ])
    expect(
      toAdmissionRequest({ ...values, parents: { ...linked, existingParentId: 'p1' } }).parents,
    ).toEqual({
      mode: 'existing',
      parentId: 'p1',
    })
  })

  it('requires complete bank details once started', () => {
    const values = filledAdmission()
    expect(messages({ ...values, bank: { ...values.bank, accountNumber: '', ifsc: '' } })).toEqual([
      'Enter the account number',
      'Enter the IFSC',
    ])
  })

  it('needs both a name and a file on a document row that isn’t empty', () => {
    const values = filledAdmission()
    expect(
      messages({
        ...values,
        documents: {
          custom: {},
          files: [
            { name: '', file: pdf() },
            { name: 'Marksheet', file: null },
          ],
        },
      }),
    ).toEqual(['Name the document, like Birth Certificate', 'Choose a file for this document'])
  })
})

describe('filterParentAccounts', () => {
  const accounts = [
    {
      id: 'p1',
      name: 'Sample Parent 01',
      phone: '+91 90000 00001',
      email: 'parent01@example.com',
      children: [],
    },
    {
      id: 'p2',
      name: 'Sample Parent 02',
      phone: '+91 90000 00002',
      email: 'parent02@example.com',
      children: [],
    },
  ]

  it('matches name, email or phone once 2 characters are typed', () => {
    expect(filterParentAccounts(accounts, 's')).toEqual([])
    expect(filterParentAccounts(accounts, 'parent 02').map((account) => account.id)).toEqual(['p2'])
    expect(filterParentAccounts(accounts, 'parent01@').map((account) => account.id)).toEqual(['p1'])
    expect(filterParentAccounts(accounts, '9000000001').map((account) => account.id)).toEqual([
      'p1',
    ])
  })
})

describe('fee groups', () => {
  const groups = [
    { id: 'tuition', name: 'Tuition Fees 2026-2027' },
    { id: 'library', name: 'Library Fees 2026-2027' },
  ]

  it('searches and selects', () => {
    expect(filterFeeGroups(groups, 'libr').map((group) => group.id)).toEqual(['library'])
    expect(toggleId(['tuition'], 'tuition')).toEqual([])
    expect(addIds(['tuition'], ['tuition', 'library'])).toEqual(['tuition', 'library'])
    expect(removeIds(['tuition', 'library'], ['library'])).toEqual(['tuition'])
  })
})

describe('document files', () => {
  it('checks type and size', () => {
    expect(validateDocumentFile({ type: 'text/plain', size: 10 })).toMatch(/PDF/)
    expect(validateDocumentFile({ type: 'image/png', size: 6 * 1024 * 1024 })).toMatch(/5 MB/)
    expect(formatFileSize(2048)).toBe('2 KB')
  })
})
