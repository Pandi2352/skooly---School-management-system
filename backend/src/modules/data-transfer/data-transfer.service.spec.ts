import { Model } from 'mongoose'
import { StudentDocument } from '../students/schemas/student.schema'
import { UserDocument } from '../users/schemas/user.schema'
import { DataTransferService } from './data-transfer.service'

describe('DataTransferService', () => {
  let service: DataTransferService
  let studentModel: {
    find: jest.Mock
    countDocuments: jest.Mock
    create: jest.Mock
  }
  let userModel: {
    find: jest.Mock
    create: jest.Mock
  }

  beforeEach(() => {
    studentModel = {
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([{ admissionNo: 'ADM-2026-0001' }]),
        }),
      }),
      countDocuments: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(10) }),
      create: jest.fn().mockResolvedValue({ _id: 'student-created' }),
    }

    userModel = {
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([{ emailKey: 'existing@school.in' }]),
        }),
      }),
      create: jest.fn().mockResolvedValue({ _id: 'user-created' }),
    }

    service = new DataTransferService(
      studentModel as unknown as Model<StudentDocument>,
      userModel as unknown as Model<UserDocument>,
    )
  })

  it('provides template columns and sample row for students', () => {
    const template = service.getTemplate('students')
    expect(template.entityType).toBe('students')
    expect(template.columns.length).toBeGreaterThan(3)
    expect(template.sampleRows).toHaveLength(1)
  })

  it('detects invalid grade, missing name, and duplicate admission number during preview', async () => {
    const result = await service.previewImport({
      entityType: 'students',
      records: [
        { name: '', grade: 'invalid', section: '' },
        { name: 'Valid Student', grade: 5, section: 'A', admissionNo: 'ADM-2026-0001' }, // duplicate in DB
        { name: 'Good Student', grade: 3, section: 'B', admissionNo: 'ADM-2026-9999' }, // valid
      ],
    })

    expect(result.totalCount).toBe(3)
    expect(result.validCount).toBe(1)
    expect(result.invalidCount).toBe(2)
    expect(result.errors.length).toBeGreaterThanOrEqual(3)
  })

  it('commits only valid records into student database', async () => {
    const result = await service.commitImport({
      entityType: 'students',
      records: [
        { name: 'Good Student 1', grade: 5, section: 'A' },
        { name: '', grade: 5, section: 'A' }, // invalid, will be skipped
      ],
    })

    expect(result.success).toBe(true)
    expect(result.insertedCount).toBe(1)
    expect(studentModel.create).toHaveBeenCalledTimes(1)
  })

  it('exports formatted student roster data', async () => {
    const exportResult = await service.getExportData('students', { grade: 5 })
    expect(exportResult.headers).toContain('Admission No')
    expect(exportResult.headers).toContain('Full Name')
    expect(exportResult.filename).toContain('students-roster')
  })
})
