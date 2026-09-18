import { Model } from 'mongoose'
import { StudentDocument } from '../students/schemas/student.schema'
import { AdmissionsRepository } from './admissions.repository'
import { AdmissionsService } from './admissions.service'
import { SEED_ADMISSION_APPLICATIONS } from './constants/admissions.constants'
import { AdmissionApplicationDocument } from './schemas/admission-application.schema'

const mockDoc = {
  _id: 'app-id-1',
  applicationNo: 'APP-2026-001',
  student: { ...SEED_ADMISSION_APPLICATIONS[0].student },
  parent: { ...SEED_ADMISSION_APPLICATIONS[0].parent },
  documents: [{ name: 'Birth Certificate', status: 'verified' }],
  status: 'under-review',
  appliedAt: new Date('2026-03-01'),
} as unknown as AdmissionApplicationDocument

describe('AdmissionsService', () => {
  let service: AdmissionsService
  let repository: jest.Mocked<AdmissionsRepository>
  let studentModel: {
    countDocuments: jest.Mock
    create: jest.Mock
  }

  beforeEach(() => {
    repository = {
      ensureSeedData: jest.fn().mockResolvedValue(undefined),
      find: jest.fn().mockResolvedValue([mockDoc]),
      count: jest.fn().mockResolvedValue(1),
      findById: jest.fn().mockResolvedValue(mockDoc),
      findByApplicationNo: jest.fn().mockResolvedValue(mockDoc),
      create: jest.fn().mockResolvedValue(mockDoc),
      updateStatus: jest.fn().mockResolvedValue({ ...mockDoc, status: 'approved' }),
      markEnrolled: jest.fn().mockResolvedValue({ ...mockDoc, status: 'enrolled', enrolledStudentId: 'student-123' }),
      getStats: jest.fn().mockResolvedValue({
        total: 5,
        underReview: 2,
        approved: 1,
        enrolled: 1,
        rejected: 1,
      }),
    } as unknown as jest.Mocked<AdmissionsRepository>

    studentModel = {
      countDocuments: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(10) }),
      create: jest.fn().mockResolvedValue({ _id: 'student-123' }),
    }

    service = new AdmissionsService(repository, studentModel as unknown as Model<StudentDocument>)
  })

  it('initializes seed data on module init', async () => {
    await service.onModuleInit()
    expect(repository.ensureSeedData).toHaveBeenCalled()
  })

  it('lists filtered admission applications', async () => {
    const res = await service.list({ status: 'under-review', page: 1, limit: 10 })
    expect(res.items).toHaveLength(1)
    expect(res.items[0].applicationNo).toBe('APP-2026-001')
    expect(res.total).toBe(1)
  })

  it('retrieves stats breakdown', async () => {
    const stats = await service.getStats()
    expect(stats.total).toBe(5)
    expect(stats.underReview).toBe(2)
  })

  it('updates application status with reviewer notes', async () => {
    const res = await service.updateStatus('app-id-1', {
      status: 'approved',
      reviewerNotes: 'Verified and approved',
    })
    expect(repository.updateStatus).toHaveBeenCalledWith('app-id-1', 'approved', 'Verified and approved')
    expect(res.status).toBe('approved')
  })

  it('enrolls an approved applicant into students collection', async () => {
    const res = await service.enroll('app-id-1', { section: 'B' })
    expect(studentModel.create).toHaveBeenCalled()
    expect(repository.markEnrolled).toHaveBeenCalled()
    expect(res.studentId).toBeDefined()
  })
})
