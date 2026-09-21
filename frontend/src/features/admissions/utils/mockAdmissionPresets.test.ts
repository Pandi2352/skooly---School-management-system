import { describe, expect, it } from 'vitest'
import { admissionFormSchema } from '../schemas/admission.schema'
import { toAdmissionRequest } from './admissionRequest'
import { getMockAdmissionBoy, getMockAdmissionGirl } from './mockAdmissionPresets'

describe('mockAdmissionPresets', () => {
  it('validates mock boy admission against admissionFormSchema', () => {
    const boyData = getMockAdmissionBoy()
    const parsed = admissionFormSchema.safeParse(boyData)
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.personal.firstName).toBe('Rohan')
      expect(parsed.data.personal.photo).toBe('/mock/student_photo_boy.jpg')
      expect(parsed.data.academic.admissionNo).toBe('ADM-2026-001')
      expect(parsed.data.parents.guardian).toBe('father')
      expect(parsed.data.bank.ifsc).toBe('SBIN0001234')
    }
  })

  it('validates mock girl admission against admissionFormSchema', () => {
    const girlData = getMockAdmissionGirl()
    const parsed = admissionFormSchema.safeParse(girlData)
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.personal.firstName).toBe('Ananya')
      expect(parsed.data.personal.photo).toBe('/mock/student_photo_girl.jpg')
      expect(parsed.data.academic.admissionNo).toBe('ADM-2026-002')
      expect(parsed.data.parents.guardian).toBe('mother')
      expect(parsed.data.bank.ifsc).toBe('HDFC0000128')
    }
  })

  it('converts both mock presets into valid AdmissionRequest payloads', () => {
    const boyReq = toAdmissionRequest(getMockAdmissionBoy())
    expect(boyReq.student.name).toBe('Rohan Kumar Verma')
    expect(boyReq.academic.grade).toBe(5)
    expect(boyReq.academic.openingDuePaise).toBe(150000)
    expect(boyReq.student.photo).toBe('/mock/student_photo_boy.jpg')

    const girlReq = toAdmissionRequest(getMockAdmissionGirl())
    expect(girlReq.student.name).toBe('Ananya Devi Sharma')
    expect(girlReq.academic.grade).toBe(8)
    expect(girlReq.academic.openingDuePaise).toBe(0)
    expect(girlReq.student.photo).toBe('/mock/student_photo_girl.jpg')
  })
})
